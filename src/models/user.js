const mongoose = require('mongoose')
const validator = require('validator')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const { number } = require('yargs')
const userSchema = new mongoose.Schema({
    // name: {
    // type: String,
    // required : true,
    // trim: true
    // },
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true,
        validate(value) {
            if (!validator.isEmail(value)) {
                throw new Error("Invalid Email")
            }
        }
    },
    password: {
        type: String,
        required: true,
        validate(value) {
            if (value.length < 7)
                throw new Error("Too small")
        },
        trim: true,
        validate(value) {
            if (value.includes('password'))
                throw new Error("Invalid Choice")
        }
    },
    image: {
        // type: Buffer,
        type: String,
        trim: true,
    },
    first_name: {
        type: String,
        trim: true,
    },
    last_name: {
        type: String,
        trim: true
    },
    phone: {
        type: Number,
        trim: true
    },
    age: {
        type: Number,
        trim: true
    },
    latitude: {
        type: Number
    },
    longitude: {
        type: Number
    },
    gender: {
        type: String
    },
    bio: {
        type: String
    },
    first_time: {
        type: Boolean,
        default: false
    },
    likes: [{
        type: String
    }],
    dislikes: [{
        type: String
    }],
    rooms: [{
        type: {}
    }],
    tokens: [{  //token array for multiple tokens from multiple devices
        token: {
            type: String,
            required: true
        }
    }]
}, {
    timestamps: true
})

// Hashing password
userSchema.pre('save', async function(next) {
    const user = this

    // middleware
    if (user.isModified('password')) {
        user.password = await bcrypt.hash(user.password, 8)
    }
    console.log('Just before saving')
    next()
})


// generting authentication token
userSchema.methods.generateAuthToken = async function() {
    const user = this
    //sign fn is used to generate token using unique key
    const token = jwt.sign({ _id: user._id.toString() }, 'tokenkey')    //unique token generated
    //pushing token into token array
    user.tokens = user.tokens.concat({ token })
    // console.log(token)
    await user.save()
    return token
}


// Verifying logging in Credentials
userSchema.statics.findByCredentials = async(email, password) => {
    const user = await User.findOne({ email })
    if (!user) {
        throw new Error('Unable to Login')
    }
    const isMatch = await bcrypt.compare(password, user.password)
    if (!isMatch) {
        throw new Error('Username of Password is Incorrect')
    }
    return user
}

// to avoid token outputn and avatar
userSchema.methods.toJSON = function() {
    const user = this
    const userObject = user.toObject()

    delete userObject.password
    delete userObject.tokens
    delete userObject.avatar

    return userObject
}


const User = mongoose.model('User', userSchema)
module.exports = User