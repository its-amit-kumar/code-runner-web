const express = require('express')
const router = express.Router()
const user = require("../controller/user")

router.get('/getInfo', user.getInfo)
router.get('/isLoggedin', (req, res) => {
    res.status(200)
    res.json({success:true})
})
// add validation for the below route
router.get('/sendVerificationEmail', user.sendVerificationEmail)
module.exports = router