const express = require('express')
const rabbitMQConnectionInit = require('./config/rabbitmq').intializeConnectionToRabbitMq
const submitCode = require('./routes/submitCode')
const dotenv = require("dotenv")
const getSubmission = require('./routes/getSubmission')
const user = require('./routes/user')
const app = express()

dotenv.config()
const connectDB = require('./config/db')
connectDB()
rabbitMQConnectionInit()

var cors = require("cors");
app.use(cors());
app.use(express.json())
app.use(express.urlencoded({extended : true}))
app.use('/user', user)
app.use('/submitCode', submitCode)
app.use('/getSubmission', getSubmission)
console.log("listening")
app.listen(5000)