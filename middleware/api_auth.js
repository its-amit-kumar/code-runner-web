const jwt = require("jsonwebtoken")
const tokenInfo = require("../models/apiToken")
require('dotenv').config()



api_auth = async (req, res, next) => {
    if(!req.headers.hasOwnProperty("api-key")){
        res.status(401)
        res.json({status:false, errorCode:1, errorMessage:"API key not found in the request"})
        return 
    }
    const token = req.headers["api-key"]
    const tokenEntry = await tokenInfo.find({apiToken : token})
    if(Object.keys(tokenEntry).length === 0){
        res.status(400)
        res.json({status:false, errorCode:2, errorMessage:"Invalid api-key"})
        return
    }
    next()



}

module.exports = api_auth