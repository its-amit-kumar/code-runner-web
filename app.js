const express = require('express')
const rabbitMQConnectionInit = require('./config/rabbitmq').intializeConnectionToRabbitMq
const submitCode = require('./routes/submitCode')
const dotenv = require("dotenv")
const getSubmission = require('./routes/getSubmission')
const user = require('./routes/user')
const app = express()
const auth = require('./middleware/auth')
const premium = require('./routes/premium')
const userInfo = require('./routes/userInfo')
const api = require('./routes/api')
const api_auth = require('./middleware/api_auth')
const { Validator, ValidationError } = require("express-json-validator-middleware")
const {setupLogging} = require("./middleware/logging")
dotenv.config()
const connectDB = require('./config/db')
connectDB()
rabbitMQConnectionInit()
setupLogging(app)
app.use(express.static('public'));
var cors = require("cors");
app.use(cors());
app.use(express.json())
app.use(express.urlencoded({extended : true}))
app.use('/user', user)
app.use('/userInfo', auth, userInfo)
app.use('/submitCode', submitCode)
app.use('/getSubmission', getSubmission)
app.use('/premium', auth, premium)
app.use('/api', api_auth, api)
app.use((error, request, response, next) => {
    console.log("----------------------------------")
    console.log(error)
    console.log("---------------------------")
    console.log(error.validationErrors)
    console.log(error.validationErrors.body[0].params)
  // Check the error is a validation error
  if (error instanceof ValidationError) {
    // Handle the error
    // instancePath has the error parameter
    // keyword has the reason of the error
    // message has the message of the error
    // 1. keyword:type - the type of instancePath is incorrect
    // 2. keyword:required - one of the required parameter is missing but instance path remains empty in this case,
    // the missing parameter can be found in params with key as missingProperty
    // 3. keyword:enum - The supplied value is not allowed, it should only be within allowed valued, the allowed values can be found in params with key as allowedValues mapping to an array of allowed values
    // 4. keyword:minimum - The supplied value is below the minimum value, the threshold of minimum value can be found in params with key as limit
    // 5. keyword:maximum - same as above but with maximum
    // 6. keyword:pattern - The supplied value does not match the pattern, the pattern can be found in params with key as pattern
    // 1
    if(error.validationErrors.body[0].keyword == "type"){
      response.status(400).json({
        success: false,
        errorCode:1,
        errorParameter: error.validationErrors.body[0].instancePath.substr(1),
        errorReason: error.validationErrors.body[0].keyword,
        errorMessage: error.validationErrors.body[0].message,
      })
    }
    else if(error.validationErrors.body[0].keyword == "required"){
      response.status(400).json({
        success: false,
        errorCode:2,
        errorParameter: error.validationErrors.body[0].params.missingProperty,
        errorReason: error.validationErrors.body[0].keyword,
        errorMessage: error.validationErrors.body[0].message
      })
    }
    else if(error.validationErrors.body[0].keyword == "enum"){
        response.status(400).json({
          success: false,
          errorCode:3,
          errorParameter: error.validationErrors.body[0].instancePath.substr(1),
          errorReason: error.validationErrors.body[0].keyword,
          errorMessage: error.validationErrors.body[0].message,
          allowedValues: error.validationErrors.body[0].params.allowedValues
        })
      }
    else if(error.validationErrors.body[0].keyword == "minimum"){
      response.status(400).json({
        success: false,
        errorCode:4,
        errorParameter: error.validationErrors.body[0].instancePath.substr(1),
        errorReason: error.validationErrors.body[0].keyword,
        errorMessage: error.validationErrors.body[0].message,
        limit: error.validationErrors.body[0].params.limit
      })
    }
    else if(error.validationErrors.body[0].keyword == "maximum"){
      response.status(400).json({
        success: false,
        errorCode:5,
        errorParameter: error.validationErrors.body[0].instancePath.substr(1),
        errorReason: error.validationErrors.body[0].keyword,
        errorMessage: error.validationErrors.body[0].message,
        limit: error.validationErrors.body[0].params.limit
      })
    }
    else if(error.validationErrors.body[0].keyword == "pattern"){
      response.status(400).json({
        success: false,
        errorCode:6,
        errorParameter: error.validationErrors.body[0].instancePath.substr(1),
        errorReason: error.validationErrors.body[0].keyword,
        errorMessage: error.validationErrors.body[0].message,
        pattern: error.validationErrors.body[0].params.pattern
      })
    }
    else{
      response.status(400).send(error.validationErrors);
    }
    next();
  } else {
    // Pass error on if not a validation error
    next(error);
  }
});

console.log("listening")
app.listen(5000)