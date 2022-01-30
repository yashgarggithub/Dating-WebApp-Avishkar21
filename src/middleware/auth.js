const jwt = require('jsonwebtoken')
const User = require('../models/user')

// next is used in middlewares
// by the call of next the code below the next() 
// will execute after all the middleware functions are finsihed 
const auth = async(req, res, next) => {
    try {
        // const token = req.cookies.Token

        //recieving token from header
        const token = req.headers.token

        // const token = req.params.auth
        // console.log('11',token)
        if (token === undefined) {
            console.log('Executing')
            next()
        } else {
            // console.log('18')

            //jwt.verify -> verifies if token even exists or not
            //decoded stores the id of user associated with the token
            const decoded = jwt.verify(token, 'tokenkey')
                // console.log('20',decoded)
            const user = await User.findOne({ _id: decoded._id })   //finds user via id
            if (!user) {
                throw Error()
            }
            //earlier the token was fetched from headers
            //now we are storing token& user in request
            req.token = token   
            req.user = user
                // console.log('26',user)
            next()
        }
    } catch (e) {
        console.log('30', e)
        res.status(401).send('Authentication failed')
    }
}

module.exports = auth


// const jwt = require('jsonwebtoken')
// const User = require('../models/user')

// const auth = async (req,res,next)=>{
//     // console.log('auth middleware')
//     // next()
//     try {
//         // const token = req.header('Authorization').replace('Bearer ', '')
//         console.log('xx',req.cookies.Token)
//         const token = req.cookies.Token
//         console.log('Token',token)
//         if(token === undefined){
//             console.log('Executing')
//             next()}
//         else{
//        // console.log('TOken',token)
//         const decoded = jwt.verify(token, 'tokenkey')
//       //  console.log('DECO',decoded)
//         const user = await User.findOne({ _id: decoded._id, 'tokens.token': token })
//         console.log('User',user)
//       //  console.log('USER',user)
//      //   console.log(user)
//        //console.log("AUTH JS FILE")
//         if (!user) {
//             throw new Error()
//         }

//         req.token = token
//         req.user = user
//         next()}
//     } catch (e) {
//         console.log(e)
//         res.status(401).send({ error: 'Please authenticate.' })
//     }
// }

// module.exports = auth