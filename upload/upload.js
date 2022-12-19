const AWS = require('aws-sdk')
const fs = require('fs')
require('dotenv').config()
const s3 = new AWS.S3({
    accessKeyId: "AKIAYYLBT6DKMMHV43QC",
    secretAccessKey: "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",
})

const filename = "test.txt"
const fileContent = fs.readFileSync(filename)

const params = {
    Bucket: "code-runner-questions",
    Key: filename,
    Body: fileContent
}

s3.upload(params, (err, data) => {
    if (err) {
        throw err
    }
    console.log(`File uploaded successfully. ${data.Location}`)
})