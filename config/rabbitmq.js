const amqp = require('amqplib/callback_api');
require('dotenv/config')

intializeConnectionToRabbitMq = () => {
amqp.connect(process.env.RABBIT_URI, (error0, connection) => {
        if(error0){
            console.log("Error: Connection to RabbitMQ failed")
            throw error0;
        }
        console.log("Connection to RabbitMQ initialized")
        connection.createChannel(function(error1, channel){
            if(error1){
                console.log("Failed to create channel")
                throw error1;
            }
            console.log("Channel Created Successfully");
            module.exports.rabbitMQConnection = channel
        })
    })
}

module.exports.intializeConnectionToRabbitMq = intializeConnectionToRabbitMq