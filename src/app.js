const path = require('path')
const express = require('express')
const app = express();
const bodyParser = require('body-parser')
const mongoose = require('./db/mongoose')
var cookieParser = require('cookie-parser')
const User = require('./models/user')
const { router, x } = require('./router/user')
const http = require('http')
const cors = require('cors');
app.use(cors());

const msgModel = require('./models/messages')

console.log('14', x)


// 
const { generateMessage, generateLocationMessage } = require('./utils/messages')
const { addUser, removeUser, getUser, getUsersInRoom } = require('./utils/users')
const { addRoom, recountRoom, getAllRooms } = require('./utils/rooms')


// const corsOptions = {
//   origin: "localhost:4200",
//   credentials: true,
// };
// const yourCustomCorsMw = cors(corsOptions);
// app.use(yourCustomCorsMw);
// app.options('*' ,yourCustomCorsMw);
// app.set('trust proxy', 1) 

// app.use(cors( {
//     origin: 'http://localhost:4200',
//     allowedHeaders: ['Content-Type', 'Authorization']
//     credentials: true
// } ));
// app.use(cors( {
//     origin: 'http://localhost:4200',
//     allowedHeaders: ['Content-Type', 'Authorization'],
//     credentials: true
// } ));

// Chat App

// const socketio = require('socket.io')

// const server = http.createServer(app)   //done by express itself but we are doint it seperately to use socket
// server.use(cors());
const server = app.listen(3000, () => {
    console.log('Server is up on port 3000');
})

// const io = socketio(server) //configures socket.io with the server


// handle cors sepparately for socket
const io = require('socket.io')(server, {
    cors: {
        origin: "http://localhost:4200",
        methods: ["GET", "POST"]
    }
});
//runs when client connects
io.on('connection', (socket) => { //socket: object whose methods will be used
    console.log('41 New webSocket Connection');
    // socket.on('message', (msg) => {
    //     console.log(msg);
    //     socket.broadcast.emit('message-broadcast', msg);
    // });
    //existing rooms
    io.emit('showExistingRooms', getAllRooms())
    console.log('Emitted show existing rooms');

    //JOINS ROOM
    socket.on('join', ({ username, room }, callback) => {
        const { error, user } = addUser({ id: socket.id, username, room })
        if (error) {
            return callback(error)
        }

        console.log('adding user', username);
        console.log('to room', room);
        addRoom(user.room)
        socket.join(user.room)


        // Below query returns a promise and it is accessed using
        // .then() and .catch
        const chatHistoryPromise = msgModel.find({ room }).exec()
        console.log('89', chatHistoryPromise);
        chatHistoryPromise.then((result) => {
                socket.emit('chat-history', result)
                console.log('93: ', result);
            })
            // socket.emit('chat-history', chatHistory)
            // chatHistory.forEach((chat) => {
            //     socket.emit('chat-history', chat)
            // })

        // SHOW HISTORY
        //  msgModel.find().then((result) => {
        //     // console.log('History show step1');
        //     socket.emit('chat-history', { result, room: user.room })
        // }).catch((e) => {
        //     console.log('History step1 error:', e);
        // })


        callback()
    })


    //SSEND MESSAGE
    socket.on('sendMessage', (data, callback) => {
        // const currUser = getUser(socket.id)
        const currMessage = new msgModel({
            msg: data.messageToSend,
            locationMsg: null,
            username: data.username,
            createdAt: new Date().getTime(),
            room: data.room
        })
        currMessage.save().then(() => {
            console.log('100 currMessage:', currMessage);
            console.log('101 app.js sending msg ', data.messageToSend);
            console.log('in room', data.room);
            io.to(currMessage.room).emit('message', currMessage)
                // io.to(data.room).emit('message', ({
                //     messageRecieved: data.messageToSend,
                //     username: data.username
                // }))

            callback()
        }).catch((e) => {

        })

    })

    socket.on('sendLocation', (data, callback) => {
        const urlString = `https://google.com/maps?q=${data.locationToSend.latitude},${data.locationToSend.longitude}`
        const currMessage = {
                msg: null,
                locationMsg: urlString,
                username: data.username,
                createdAt: new Date().getTime(),
                room: data.room
            }
            // const currMessage = new msgModel({
            //     msg: null,
            //     locationMsg: urlString,
            //     username: data.username,
            //     createdAt: new Date().getTime(),
            //     room: data.room
            // })
            // currMessage.save().then(() => {
        console.log('100 currMessage:', currMessage);
        console.log('101 app.js sending msg ', data.locationToSend);
        console.log('in room', data.room);
        io.to(currMessage.room).emit('message', currMessage)

        callback()
            // })
    })
});

// server.listen(4000,() =>{
//   console.log('chat server is up on 4000')
// })


app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});
// app.use(function (req, res, next) {
//   res.header("Access-Control-Allow-Origin", "*");
//   res.header(
//     "Access-Control-Allow-Headers",
//     "Origin, X-Requested-With, Content-Type, Accept, Authorization"
//   );

//   if (req.method === "OPTIONS") {
//     res.header(
//       "Access-Control-Allow-Methods",
//       "PUT, POST, PATCH, DELETE, GET, OPTIONS"
//     );
//     return res.status(200).json({});
//   }
//   next();
// });
app.use(bodyParser.urlencoded({ extended: false }))
app.use(express.json({ extended: false }))
app.use(cookieParser())

app.use('/', router)


// app.listen(3000, () =>{
//     console.log('Server is up on port 3000');
// })