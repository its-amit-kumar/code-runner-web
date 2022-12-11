const express = require('express')
const router = express.Router()
const auth = require("../controller/auth")
const {registerUserSchema, loginUserSchema} = require("../json-validator/allJsonValidators")
const { Validator } = require("express-json-validator-middleware")
const {validate} = new Validator()

router.post('/register', validate({body:registerUserSchema}), auth.register)
router.post('/login', validate({body:loginUserSchema}), auth.login)
module.exports = router