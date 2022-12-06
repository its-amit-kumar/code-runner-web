const jwt = require("jsonwebtoken")
require('dotenv').config()

auth = (req, res, next) => {
    const jwtSecretKey =  process.env.SECRET_JWT
    try{
        if (req.headers.authorization.startsWith("Bearer ")){
            var tokenJwt = req.headers.authorization.substring(7, req.headers.authorization.length);
        } else {
            res.status(401)
            res.json({success:false, "errorMessage":"Bearer token not found", errorCode:"3"})
            return
        }
        const verified = jwt.verify(tokenJwt, jwtSecretKey)
        if(verified){
            next()
        }else{
            res.status(401)
            res.send({"success":false, "errorMessage":"User not logged in", "errorCode":"1"})
            return
        }
    }
    catch(error){
       res.status(401)
       res.send({"success":false, "errorMessage":"Error occured while authentication", "errorCode":"2"})
       return

    }
}

module.exports = auth