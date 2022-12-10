const { 
  v4: uuidv4,
} = require('uuid');
let submission = require("../models/submission")
class runCode{
    constructor(props){
        this.props = props;
        this.queue = "codeQueue";
    }
    makeInitialEntry = async () => {
        var submissionData = new submission({
            Id:this.Id,
            timeTaken:-1,
            memoryTaken:-1,
            err:"-",
            stderr:"-",
            stdout:"-",
            isCompleted:-1,
        })
        await submissionData.save();

    }
    sendRequestToQueue = async (error0, connection) => {
        var channel = require("../config/rabbitmq").rabbitMQConnection
        var queueToBeUsed = this.queue
        var msgToBeSend = this.msg
        
            await channel.assertQueue(queueToBeUsed,{
                durable:true
            });
            await channel.sendToQueue(queueToBeUsed, Buffer.from(msgToBeSend), {
                persistent:true
            });
    }
    makeSubmission = async () =>{
        this.Id = await submission.countDocuments({})
        //throw new error("hello error")
        var msg = JSON.stringify({
            Id:this.Id,
            Code:this.props.Code,
            TimeLimit:this.props.TimeLimit,
            MemoryLimit:this.props.MemoryLimit,
            Language:this.props.Language,
            Input:this.props.Input
        });
        this.msg = msg
        await this.makeInitialEntry()
        var amqp = require('amqplib/callback_api');
        await this.sendRequestToQueue()
        
        return this.Id;



    }
}

module.exports = runCode