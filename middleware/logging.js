const morgan = require("morgan")
const fs = require("fs")

const setupLogging = (app) =>{
    app.use(morgan('combined', {
        stream : fs.createWriteStream('./log/access.log', {flags:'a'})
    }))
}

exports.setupLogging = setupLogging