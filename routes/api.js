const v1 = require("../controller/api_v1")
const express =  require("express")
const router = express.Router()

router.post("/v1/submitCode", v1.makeSubmission)
router.get("/v1/getInfo", v1.getInfo)
router.post("/v1/getSubmission", v1.getSubmission)

module.exports = router