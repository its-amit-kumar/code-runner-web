const mongoose = require('mongoose')
require('mongoose-long')(mongoose);
const {Types: {Long}} = mongoose;

function getCosts(value) {
    if (typeof value !== 'undefined') {
       return parseFloat(value.toString());
    }
    return value;
};


const submission = mongoose.Schema({
    Id:{
        type: Long,
        required:true,
    },
    isCompleted:{
        type:Number,
        required:true,

    },
    err:{
        type:String,
        required:true,
    },
    timeTaken:{
        type:mongoose.Types.Decimal128,
        required:true,
        get:getCosts
    },
    memoryTaken:{
        type:mongoose.Types.Decimal128,
        required:true,
        get:getCosts
    },
    stdout:{
        type:String,
        required:true,
    },
    stderr:{
        type:String,
        required:true,
    }

})



module.exports = mongoose.model("submission", submission)