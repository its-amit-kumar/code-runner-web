const express = require('express')
const router = express.Router()
const {makeCodeSubmission} = require('../controller/makeCodeSubmisson')
const { Validator } = require("express-json-validator-middleware")

const submissionSchema = {
    type:"object",
    required : ["Code", "TimeLimit", "MemoryLimit", "Language", "Input"],
    properties : {
        Code:{
            type: "string",
            maxLength: 8192,
        },
        TimeLimit:{
            type:"integer",
            enum:[1]
        },
        MemoryLimit:{
            type:"integer",
            minimum:13000,
            maximum:100000
        },
        Language:{
            type:"string",
            enum:["cpp", "c", "java", "javascript", "python"]
        },
        Input:{
            type:"string",
            maxLength:65536
        }
    }
}

const {validate} = new Validator()
router.post('/', validate({body:submissionSchema}),makeCodeSubmission)
module.exports = router