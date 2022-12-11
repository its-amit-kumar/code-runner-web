const v1 = require("../controller/api_v1")
const express =  require("express")
const { Validator } = require("express-json-validator-middleware")
const router = express.Router()
const {apiv1_getSubmissionSchema, apiv1_submissionSchema} = require('../json-validator/allJsonValidators')
const {validate} = new Validator()
router.post("/v1/submitCode", validate({body:apiv1_submissionSchema}), v1.makeSubmission)
router.get("/v1/getInfo", v1.getInfo)
router.post("/v1/getSubmission",validate({body:apiv1_getSubmissionSchema}), v1.getSubmission)

module.exports = router