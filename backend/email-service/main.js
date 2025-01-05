import amqp from "amqplib/callback_api.js";

amqp.connect(process.env.RABBITMQ_CONNECT, function(error0, connection) {
    if (error0) {
        throw error0;
    }
    connection.createChannel(function(error1, channel) {
        if (error1) {
            throw error1;
        }
        var queue = 'emails';

        channel.assertQueue(queue, {
            durable: false
        });

        console.log(" [*] Waiting for messages in %s. To exit press CTRL+C", queue);
        channel.consume(queue, function(msg) {
            const message = JSON.parse(msg.content.toString());

            console.log(" Sending email with following info: email: %s, concert: %s, artist: %s, location: %s, date: %s, price: %s", message.email, message.concertName, message.artist, message.location, message.date, message.price);
        }, {
            noAck: true
        });
    });
});

