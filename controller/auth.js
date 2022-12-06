require('dotenv').config()
 user = require("../models/user")
const apiTokenModel = require("../models/apiToken")
const conn = require("mongoose")
const generateApiKey =  require("generate-api-key").generateApiKey
const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")
const createHash = async(plainText) =>{
    const saltRounds = 10

    const salt = await bcrypt.genSalt(saltRounds)
    return await bcrypt.hash(plainText, salt)
}

const register = async (req, res) => {
    const email = req.body.email 
    const firstName = req.body.firstName 
    const secondName = req.body.secondName 
    const password = await createHash(req.body.password)
    try{
        var alreadyExists = await user.find({email:email})
    }
    catch(error){
        console.log("An error occured while getting user")
        console.log(error)
        res.json({success:false, errorCode:"-1", errorMessage:"Cannot register user right now"})
    }
    if(Object.keys(alreadyExists).length > 0){
        console.log(alreadyExists)
        console.log(typeof alreadyExists)
        res.json({success:false, errorCode:"1", errorMessage:"Email already registered"})
        return 
    }
    const session = await conn.startSession()
    try{
        session.startTransaction()
        const apiKey = generateApiKey({
            method : 'bytes',
            length : 32,
            prefix: "code_submission"
        })
        const newUser = new user({
            email : email,
            firstName: firstName,
            secondName: secondName,
            password:password,
            isEmailVerified:false,
            apiToken:apiKey
        })
        newUser.save({session})
        const newApiToken = new apiTokenModel({
        apiToken:apiKey,
        apiVersion:"v1",
        maximumCalls:100,
        callsMade:0
        })
        newApiToken.save({session})
        await session.commitTransaction()
        res.json({success:true, errorCode:"0", errorMessage:""})
    }
    catch(error){
       console.log("-----------------")
       console.log("An error occured in the transaction")
       console.log(error)
       console.log("--------------------") 
       res.json({success:false, errorCode:"-1", errorMessage:"An error occured while registering user"})
       await session.abortTransaction()
    }
    session.endSession()
    
}

const login =  async(req, res) => {
    const email = req.body.email
    const password = await createHash(req.body.password) 
    try{
    const loggedInUser = await user.find({email:email, password:password})
    if(Object.keys(loggedInUser).length === 0){
        const jwtSecretKey = process.env.SECRET_JWT
        const token = jwt.sign(
            {
                email : loggedInUser.email,
                firstName : loggedInUser.firstName,
                secondName : loggedInUser.secondName
            },
            jwtSecretKey,
            {
                expiresIn:"150h"
            }
        )
        res.json({success:true, token:token})
    }
    else{
        res.json({success:false, errorCode:"2", errorMessage:"No such user exists"})
    }
    }
    catch(error){
        console.log("Error while logging user in")
        console.log(error)
        res.json({success:false, errorCode:"1", errorMessage:"Error Logging user in"})
    }
}
module.exports = {register, login}