const apiToken = require("../models/apiToken")
const submitCode = require('../controller/makeCodeSubmisson')
const getRunCodeSubmission = require('../controller/getRunCodeSubmission')
const conn = require('mongoose')
const areRequestsOver = (tokenEntry) =>{
    if(tokenEntry.maximumCalls === tokenEntry.callsMade){
        return true
    }
    return false;

}

const getInfo = async (req, res) => {
    var token = req.headers["api-key"]
    try{
        var tokenInfo = await apiToken.findOne({apiToken:token})
    }
    catch(error){
        console.log("An error occured while getting api token info")
        console.log(error)
        res.status(500)
        res.json({success:false, errorCode:1, errorMessage:"An error occured"})
        return 
    }
    res.status(200)
    res.json({success:true, maximumCalls:tokenInfo.maximumCalls, callsMade:tokenInfo.callsMade, apiVersion:tokenInfo.apiVersion})


}

const makeSubmission = async (req, res) => {
    const token = req.headers["api-key"]
    try{
        const newToken = await apiToken.findOneAndUpdate({apiToken:token}, {$inc : {'callsMade' : 1}})
        if(areRequestsOver(newToken)){
            res.status(200)
            res.json({status:false, errorCode:4, errorMessage:"Request limit reached"})
            return
        }
        try{
        await submitCode.makeCodeSubmission(req, res)
        }
        catch(error){
            const newToken = await apiToken.findOneAndUpdate({apiToken:token}, {$inc : {'callsMade' : -1}})
            res.status(500)
            res.json({success:false, errorCode:3, errorMessage:"Some error occured"})
        }
    }
    catch(error){
        console.log(error)
        res.status(500)
        res.json({success:false, errorCode:3, errorMessage:"Some error occured"})
    }
    

}

const getSubmission = async (req, res) => {
    if(!req.body.hasOwnProperty("Id")){
        res.status(401)
        res.json({status:false, errorCode:1, errorMessage:"Id not found"})
        return 
    }
    await getRunCodeSubmission.getRunCodeSubmission(req, res)
}

module.exports = {getInfo, makeSubmission, getSubmission}