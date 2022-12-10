var amqp = require('amqplib/callback_api');
const fetch = require('node-fetch')
require('dotenv/config')
const {MongoClient} = require('mongodb');
var i = 0
sendToRunCode = async (m) => {
    const options = {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(m),
    };
    var result;
    await fetch("http://13.115.172.172:5300/submitCode/", 
    options)
    .then(res => res.json())
    .then(json => {result = json})
    .catch(err => console.log(err))
    return result
}

amqp.connect('amqps://aalulqoj:CAUu_Ev2WzzLXA4eeWKl6hAzdYdgoZYj@puffin.rmq2.cloudamqp.com/aalulqoj?heartbeat=30', async (error0, connection) => {
    if (error0) {
        throw error0;
    }
    await connection.createChannel(async (error1, channel) => {
        if (error1) {
            throw error1;
        }
        try{
        var conn = new MongoClient(process.env.MONGO_URI)
        await conn.connect()
        }
        catch (e){
            console.log(e)
            process.exit(1)
        }
        var queue = 'codeQueue';

        channel.assertQueue(queue, {
            durable: true
        });
        
        console.log(" [*] Waiting for messages in %s. To exit press CTRL+C", queue);
        channel.prefetch(1)
        await channel.consume(queue, async (msg) => {
            console.log("---------------------")
            console.log("Message Number ", i)
            i++;
            console.log("received")
            m = JSON.parse(msg.content)
            console.log(m)
            try {
            var documentOfSubmission = await conn.db("test").collection("submissions").findOne({Id:m.Id})
            }
            catch(error){
                console.log(error)
            }
            console.log("The Document has been retreived")
            console.log(documentOfSubmission)
            documentOfSubmission.isCompleted = 0
            console.log("A")
            await conn.db("test").collection("submissions").findOneAndReplace({Id : documentOfSubmission.Id}, documentOfSubmission)
            var a = await sendToRunCode(m)
            console.log("Printing a", a)
            documentOfSubmission.isCompleted = 1
            documentOfSubmission.err = a.err
            documentOfSubmission.stdout = a.stdout
            documentOfSubmission.stderr = a.stderr
            documentOfSubmission.timeTaken = a.timeTaken
            documentOfSubmission.memoryTaken = a.memoryTaken
            await conn.db("test").collection("submissions").findOneAndReplace({Id : documentOfSubmission.Id}, documentOfSubmission)
            channel.ack(msg)
            console.log("done")
            console.log("--------------------------")
        }, {
            noAck:false

        });
    });

});