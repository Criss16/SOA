import express from 'express';
import jwt from 'jsonwebtoken';
const app = express()
const port = 80
import mongoose from "mongoose";
import {Concert, Ticket} from "../utils/database-utils.js"
import {Kafka} from "kafkajs";
import cors from 'cors';

app.use(cors());

//database connection
mongoose.connect(process.env.DATABASE_URL);

//kafka connection
const kafka = new Kafka({
    clientId: "my-app",
    brokers: ["kafka:9092"],
});

//init kafka
async function init() {
    const admin = kafka.admin();
    console.log("Admin connecting...");
    admin.connect();
    console.log("Admin Connection Success...");

    console.log("Creating Topic invoices");
    await admin.createTopics({
        topics: [
            {
                topic: "invoices",
                numPartitions: 1,
            },
        ],
    });
    console.log("Topic Created Success invoices");

    console.log("Disconnecting Admin..");
    await admin.disconnect();
}

init();

//connect producer to kafka
const producer = kafka.producer();

console.log("Connecting Producer");
await producer.connect();
console.log("Producer Connected Successfully");

app.use(express.json())

app.options('/tickets/:concert_id', async (req, res)=> {
    res.status(200).send("");
});

app.post('/tickets/:concert_id', async (req, res) => {
    const { token } = req.body;
    try{
        const verifToken = jwt.verify(token, process.env.JWT_KEY)
        const concert = await Concert.findOne({_id:req.params.concert_id});
        if (!concert){
            return res.status(404).json({ message: 'Invalid concert' });
        }
        const ticket = new Ticket({ eventid: concert._id, buyerid: verifToken.id });
        ticket.save().then(() => console.log('Added ticket'));

        await producer.send({
            topic: "invoices",
            messages: [
                {
                    partition: 0,
                    key: "new invoice",
                    value: JSON.stringify(ticket),
                },
            ],
        });

        res.status(200).json({ ticket: ticket, concert: concert });
    } catch(err) {
        console.error(err);
        res.status(401).json({ message: 'User not authenticated' });
    }

});

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})
