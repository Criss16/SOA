import mongoose from "mongoose";
import {Kafka} from "kafkajs";
import amqp from "amqplib/callback_api.js";
import {Concert, User} from "../utils/database-utils.js"

//database connection
mongoose.connect(process.env.DATABASE_URL);

//kafka connection
const kafka = new Kafka({
    clientId: "my-app",
    brokers: ["kafka:9092"],
});

async function init() {
    const consumer = kafka.consumer({groupId: "my-app"});
    await consumer.connect();

    await consumer.subscribe({ topics: ["invoices"], fromBeginning: true });
    amqp.connect(process.env.RABBITMQ_CONNECT, function(error0, connection) {
        if (error0) {
            throw error0;
        }
        connection.createChannel(async function(error1, channel) {
            if (error1) {
                throw error1;
            }
            var queue = 'emails';

            channel.assertQueue(queue, {
                durable: false
            });

            await consumer.run({
                eachMessage: async ({ topic, partition, message, heartbeat, pause }) => {
                   const parsedMessage = JSON.parse(message.value.toString());
                   const user = await User.findOne({_id: parsedMessage.buyerid});
                   const concert = await Concert.findOne({_id: parsedMessage.eventid});
                   if (!user || !concert){
                       console.log("Invalid user or concert on the ticket invoice.");
                        return;
                   }
                   const payload = {email: user.email, concertName: concert.eventname, artist: concert.artist, location: concert.location, date: concert.date, price: concert.price};
                    console.log(
                        `[${topic}]: PART:${partition}:`,
                        JSON.stringify(payload)
                    );
                    channel.sendToQueue(queue, Buffer.from(JSON.stringify(payload)));
                    console.log(" [x] Sent %s", JSON.stringify(payload));
                },
            });
        });
    });

}

init();
