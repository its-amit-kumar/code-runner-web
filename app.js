const express = require('express')
const rabbitMQConnectionInit = require('./config/rabbitmq').intializeConnectionToRabbitMq
const submitCode = require('./routes/submitCode')
const dotenv = require("dotenv")
const getSubmission = require('./routes/getSubmission')
const user = require('./routes/user')
const app = express()
const auth = require('./middleware/auth')
const premium = require('./routes/premium')
const api = require('./routes/api')
const api_auth = require('./middleware/api_auth')
const { Validator, ValidationError } = require("express-json-validator-middleware")
const {setupLogging} = require("./middleware/logging")
dotenv.config()
const connectDB = require('./config/db')
connectDB()
rabbitMQConnectionInit()
setupLogging(app)
var cors = require("cors");
app.use(cors());
app.use(express.json())
app.use(express.urlencoded({extended : true}))
app.use('/user', user)
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
    response.status(400).send(error.validationErrors);
    next();
  } else {
    // Pass error on if not a validation error
    next(error);
  }
});

console.log("listening")
app.listen(5000)