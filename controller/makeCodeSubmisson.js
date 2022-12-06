let runCode = require('../classes/runCode')

const makeCodeSubmission = (req, res) =>{
    currentInstance = new runCode({
        Code:req.body.Code,
        TimeLimit:req.body.TimeLimit,
        MemoryLimit:req.body.MemoryLimit,
        Language:req.body.Language,
        Input:req.body.Input
    })
    var idSubmisision = currentInstance.makeSubmission();
    res.status(202)
    res.json({success:true, submissionId:idSubmisision})

}

module.exports = {makeCodeSubmission}