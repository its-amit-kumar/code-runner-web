const mongoose = require('mongoose')
require('dotenv/config')

const connectDB = async () => {
    try{
        const conn = await mongoose.connect(process.env.MONGO_URI,{
            useNewUrlParser: true,
            retryWrites: false
        })
        console.log(`MongoDB connected : ${conn.connection.host}`)
    } catch (error) {
        console.log("Error Connecting to the DB: ")
        console.log(error)
        process.exit(1)
    }
}

module.exports = connectDB