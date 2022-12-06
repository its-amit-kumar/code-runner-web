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
console.log("listening")
app.listen(5000)