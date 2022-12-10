const express = require('express')
const router = express.Router()
const {getRunCodeSubmission} = require('../controller/getRunCodeSubmission')
const { Validator } = require("express-json-validator-middleware")
const allJsonValidator = require('../json-validator/allJsonValidators')
const {validate} = new Validator()
router.post('/', validate({body:allJsonValidator.getSubmissionSchema}), getRunCodeSubmission)
module.exports = router