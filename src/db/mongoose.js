const validator = require('validator')
const mongoose = require('mongoose')

const connectionURL = 'mongodb://127.0.0.1:27017/Avishkar2k21'
mongoose.connect(connectionURL, {
    useNewUrlParser: true,
    //  useCreateIndex: true,
    useUnifiedTopology: true
        //  useFindAndModify : false
})