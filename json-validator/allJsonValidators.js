const getSubmissionSchema = {
    type:"object",
    required:["Id"],
    properties:{
        Id:{
            type:"integer",
        }
    }
}

const registerUserSchema = {
    type:"object",
    required:["email", "firstName", "lastName", "password"],
    properties:{
        email : {
            type:"string",
            RegExp:"^([a-zA-Z0-9_\\-\\.]+)@([a-zA-Z0-9_\\-\\.]+)\\.([a-zA-Z]{2,5})$",
            maxLength:50,
            minLength:5,
        },
        firstName:{
            type:"string",
            RegExp:"^[a-zA-Z]+$",
            maxLength:50,
            minLength:1,
        },
        secondName:{
            type:"string",
            RegExp:"^[a-zA-Z]+$",
            maxLength:50,
            minLength:1,
        },
        password:{
            type:"string",
            RegExp:"^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,})",
            maxLength:200,
            minLength:8,
        }
    }
}

const loginUserSchema = {
    type:"object",
    required:["email", "password"],
    properties:{
        email : {
            type:"string",
            maxLength:50,
            minLength:5,
        },
        password:{
            type:"string",
            maxLength:200,
            minLength:8,
        }
    }
}

const submissionSchema = {
    type:"object",
    required : ["Code", "TimeLimit", "MemoryLimit", "Language", "Input"],
    properties : {
        Code:{
            type: "string",
            maxLength: 8192,
        },
        TimeLimit:{
            type:"integer",
            enum:[1]
        },
        MemoryLimit:{
            type:"integer",
            minimum:13000,
            maximum:100000
        },
        Language:{
            type:"string",
            enum:["cpp", "c", "java", "javascript", "python"]
        },
        Input:{
            type:"string",
            maxLength:65536
        }
    }
}
const apiv1_submissionSchema = submissionSchema
const apiv1_getSubmissionSchema = getSubmissionSchema

module.exports = {
    getSubmissionSchema, 
    registerUserSchema, 
    loginUserSchema,
    submissionSchema,
    apiv1_getSubmissionSchema,
    apiv1_submissionSchema
}