const path = require('path')
const express = require('express')
// multer for file upload
// but here we are not using it due to its large binary encoding
const multer = require('multer')

const cookie = require('cookie')    //packet of info which browser stores
const User = require('../models/user')
const router = new express.Router()
const auth = require('../middleware/auth')
const { builtinModules } = require('module')


const x = 5

var id1 = "0";

var id2 = "0";

//signing up route -> savin gnew user
router.post('/signup', async(req, res) => {
    console.log(req.body)
    const user = new User(req.body) //creating new user

    try {
        await user.save()
        const token = await user.generateAuthToken()
        res.status(201).send({ user, token })
    } catch (e) {
        res.status(400).send(e)
    }
})


//route for editing profile information
router.patch('/edit', auth, async(req, res) => {
    try {
        const user = req.user
            //    console.log('26', user)
            // console.log('25',req.headers.token)
        user.first_name = req.body.first_name
            // console.log('27')
        user.last_name = req.body.last_name
        user.phone = req.body.phone
        user.latitude = req.body.latitude
        user.longitude = req.body.longitude
        user.gender = req.body.gender
        user.bio = req.body.bio
        user.age = req.body.age
        user.first_time = true
        user.likes.push(user.id)    //pushing self in the likes so we cannot se self in feed
        await req.user.save()

        // sending response
        res.json(user)
        console.log('DONE')
    } catch (e) {
        console.log(e)
        res.status(400).send()
    }
})

//LOGIN USER
router.post('/login', async(req, res) => {
    try {
        // verification
        const user = await User.findByCredentials(req.body.email, req.body.password)
        if (user) {
            // giving token
            const token = await user.generateAuthToken()
                // creating cookie 
                // res.cookie('Token', token, {maxAge: 50000, httpOnly: true, secure: false})
                // console.log('55',user)
            res.json({ user, email: user.email, token });
        }
    } catch (e) {
        res.status(400).send()
    }
})

//LOGOUT
router.post('/logout', auth, async(req, res) => {
    console.log('65')
    try {
        // console.log('LOGOUT', req.user)
        req.user.tokens = req.user.tokens.filter((token) => {
            // res.clearCookie('Token')
            // console.log(token)

            //token invalidation
            return token.token !== req.headers.token
        })
        await req.user.save()
            // res.body = null
            // res.user = null;
            // console.log('73',res)
        res.send()
    } catch (e) {
        res.status(500).send()
    }
})

router.get('/usersList', auth, async(req, res) => {
    try {
        // const users = await User.find({ _id: { $ne: req.user.id } });
        const user = req.user;
        var likes = user.likes;
        var dislikes = user.dislikes;
        likes.push(user._id);
        // ES6 destructuring
        const array3 = [...likes, ...dislikes];
        // likes.concat(arr);
        // console.log('93',array3.length)
        
        // nin(Not IN) query will find all elements except those in array3
        const users = await User.find({ _id: { $nin: array3 } });

        // console.log('102', users)
        // const users = await User.find({})
        // console.log(users)
        // console.log('87',user)

        // console.log('85',users)
        // console.log('86', req.user)
        // const userMap = [];
        // users.forEach((user) => {
        //     userMap.push(user);
        // });

        //     const arr1 = [1,2,3,4]
        //     const arr2 = [2,4]
        //     x = arr1.filter(item => !arr2.includes(item));
        // console.log(x);

        // var arr = [];
        // users.forEach((index)=>{
        //     console.log(index._id)
        //     console.log('x',user._id)
        //     if(index._id != user._id){
        //         arr.push(user)
        //     }
        //     else{
        //        console.log('107',index._id) 
        //     }
        // })
        // const index = users.indexOf(user);
        // if (index > -1) {
        //     users.splice(index, 1);
        //   }
        //   console.log(index);
        // var arr = users.filter(index => index!= user);
        // console.log('103', users[0])


        res.send(users);
    } catch (e) {
        console.log('93', e)
    }
});
// router.get('/test', async(req,res)=>{

// })

router.get('/profile', auth, async(req, res) => {
    try {
        user = req.user

        console.log('154', user)
        res.send(user)
    } catch (e) {
        console.log('105', e)
    }
})

router.get('/rooms', auth, async(req, res) => {
    try {
        const user = req.user
        console.log('155', user.rooms)
        res.send(user.rooms)
    } catch (e) {
        console.log('231', e)
    }
})


// profile picture
const upload = multer({
    // dest: 'avatar',
    limits: {
        fileSize: 100000000
    },
    // cb stands for call back
    fileFilter(req, file, cb) {
        // if(!file.originalname.endsWith('.jpg'))
        // match fn matches regular expression
        if (!file.originalname.match(/\.(jpg)$/)) {
            return cb(new Error('Please upload a PNG file'))
        }
        // cb(new Error('File must be a pdf'))
        cb(undefined, true)
            // cb(underfined, false)
    }
})
router.patch('/avatar', auth, async(req, res) => {
        try {
            // console.log('182', req.file)
            // req.user.avatar = req.body.photo
            // await req.user.save()
            // console.log('131')
            // res.send()

            req.user.image = req.body.url;
            console.log('199', req.body.url);
            await req.user.save()
            res.send()
        } catch (e) {
            console.log('190', e);
        }
    })
    // router.post('/:id/avatar',  upload.single('avatar'), async (req, res) => {
    //     const user = await User.findById(req.params.id)
    //     user.avatar = req.file.buffer
    //     console.log(user.avatar)
    //     await user.save()
    //     res.send()
    // }, (error, req, res, next) => {
    //     res.status(400).send({ error: error.message })
    // })

// Deleting Profile picture
router.delete('/avatar', auth, async(req, res) => {
    req.user.avatar = undefined
    await req.user.save()
    res.send()
})

router.get('/avatar', auth, async(req, res) => {
    try {
        // console.log('146',req.user.avatar)
        const user = req.user
            // Setting header
            // res.set('Content-Type', 'image/jpeg')
        res.set('Content-Type', 'image/jpg');
        console.log('150')
        res.send(user.avatar)

    } catch (e) {
        res.status(404).send()
    }
})

// router.get('/:id/avatar', async (req, res) => {
//     try {
//         const user = await User.findById(req.params.id)

//         if (!user || !user.avatar) {
//             throw new Error()
//         }

//         res.set('Content-Type', 'image/jpg')
//         res.send(user.avatar)
//     } catch (e) {
//         res.status(404).send()
//     }
// })



router.post('/likes', auth, async(req, res) => {
    try {
        /*
        A->B
        req.user.id -> req.headers.id2
        
        we have to check 
        */
        const user = req.user
        user.likes.push(req.headers.id2);
        const user2 = await User.findById(req.headers.id2);

        // console.log('242', user2)
        // console.log(user2)
        let match = false;
        var i = 1
        if (user2) {
            const likesArray = user2.likes
            console.log('240', likesArray)
            likesArray.forEach((id) => {
                console.log(id)
                if (id == req.user._id) {
                    console.log('x')
                    match = true;
                }
            })
        }
        // console.log('246', match)
        if (match) {
            if (user._id < user._id) {
                id1 = user._id
                id2 = user2._id
            } else {
                id1 = user2._id
                id2 = user._id
            }
            console.log(id1)
            console.log(id2)
            const room = id1 + id2
            console.log('255', room)
            user.rooms.push({ room: room, user1: user.first_name, user2: user2.first_name });
            user2.rooms.push({ room: room, user1: user2.first_name, user2: user.first_name });
            await user2.save()
        }

        await user.save()
        res.json(user);
    } catch (e) {
        console.log('157', e);
        res.status(404).send()
    }
})


router.post('/dislikes', auth, async(req, res) => {
    try {
        const user = req.user;
        user.dislikes.push(req.headers.id2);
        await user.save();
        res.json(user)
    } catch (e) {
        console.log('208', e);
        res.status(404).send();
    }
})


module.exports = { router, x }