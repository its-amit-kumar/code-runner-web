const express = require('express')
const router = express.Router()
const {makeCodeSubmission} = require('../controller/makeCodeSubmisson')


router.post('/', makeCodeSubmission)
module.exports = router