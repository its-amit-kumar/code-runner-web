const express = require('express')
const router = express.Router()
const auth = require("../controller/auth")
const {registerUserSchema, loginUserSchema} = require("../json-validator/allJsonValidators")
const { Validator } = require("express-json-validator-middleware")
const {validate} = new Validator()
const user = require("../controller/user")

router.post('/register', validate({body:registerUserSchema}), auth.register)
router.post('/login', validate({body:loginUserSchema}), auth.login)
router.get('/getInfo', user.getInfo)
router.get('/verifyEmail', user.verifyEmail)
module.exports = router