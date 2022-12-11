const express = require('express')
const router = express.Router()
const {makeCodeSubmission} = require('../controller/makeCodeSubmisson')
const { Validator } = require("express-json-validator-middleware")

const {submissionSchema} = require("../json-validator/allJsonValidators")

const {validate} = new Validator()
router.post('/', validate({body:submissionSchema}),makeCodeSubmission)
module.exports = router