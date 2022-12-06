const mongoose = require('mongoose')

const apiToken= mongoose.Schema({
    apiToken:{
        type:String,
        required:true,
    },
    apiVersion:{
        type:String,
        required:true,
    },
    maximumCalls:{
        type:Number,
        required:true,
    },
    callsMade:{
        type:Number,
        required:true,
        default:0,
    }
})

module.exports = mongoose.model("apiToken", apiToken)