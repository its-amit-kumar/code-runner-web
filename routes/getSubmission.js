const express = require('express')
const router = express.Router()
const {getRunCodeSubmission} = require('../controller/getRunCodeSubmission')


router.post('/', getRunCodeSubmission)
module.exports = router