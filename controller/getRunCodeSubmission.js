const submission = require("../models/submission")

const getRunCodeSubmission = async (req, res) =>{
    var sub = await submission.findOne({Id:req.body.Id})
    if(sub == undefined){
        res.json({success:false, errorMessage:"No Such Submission Exists"})
        return
    }
    res.json({
        success:true,
        errorMessage:"",
        Id:sub.Id,
        isComplete:sub.isComplete,
        err:sub.err,
        timeTaken:sub.timeTaken,
        memoryTaken:sub.memoryTaken,
        stdout:sub.stdout,
        stderr:sub.stderr,
        isCompleted : sub.isCompleted
    })
}

module.exports = {getRunCodeSubmission}