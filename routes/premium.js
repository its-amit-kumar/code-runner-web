const express = require('express')
const router = express.Router()

router.post('', function(req, res){
    res.json({success:"done"})

})
module.exports = router