const getSubmissionSchema = {
    type:"object",
    required:["Id"],
    properties:{
        Id:{
            type:"integer",
        }
    }
}
module.exports = {getSubmissionSchema}