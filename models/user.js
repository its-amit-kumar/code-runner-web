const mongoose = require('mongoose')

const user = mongoose.Schema({
    email:{
        type:String,
        required:true,
        unique:true,
    },
    firstName:{
        type:String,
        required:true
    },
    secondName:{
        type:String,
        required:true
    },
    password:{
        type:String,
        required:true,
    },
    isEmailVerified:{
        type:Boolean,
        requried:true,
        default:false,
    },
    apiToken:{
        type:String,
        required:true,
        unique:true,
    },
    emailValidTill:{
        type:Number,
        required:true,
    },
})



module.exports = mongoose.model("user", user)