import mongoose from "mongoose";

export const userSchema = new mongoose.Schema({
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true }
});

export const User = mongoose.model('User', userSchema);

export const concertSchema = new mongoose.Schema({
    eventname: { type: String, required: true },
    artist: { type: String, required: true },
    location: { type: String, required: true },
    date: { type: Date, required: true },
    price: { type: Number, required: true },
});

export const Concert = mongoose.model('Concert', concertSchema);

export const ticketSchema = new mongoose.Schema({
    eventid: { type: mongoose.Schema.Types.ObjectId, required: true },
    buyerid: {type: mongoose.Schema.Types.ObjectId, required: true}
});

export const Ticket = mongoose.model('Ticket', ticketSchema);