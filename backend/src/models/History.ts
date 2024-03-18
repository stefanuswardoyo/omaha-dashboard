// models/History.js
import mongoose from "mongoose";

const ticketSchema = new mongoose.Schema({
  Ticket: {
    type: String,
    required: true,
    unique: true, // Add this line to enforce uniqueness
  },
  Time: {
    type: String,
    required: true,
  },
  Profit: {
    type: String,
    required: true,
  },
  InitialBalance: {
    type: String,
    required: true,
  },
});

const historySchema = new mongoose.Schema({
  Server: {
    type: String,
    required: true,
  },
  Tickets: [ticketSchema], // Array of tickets
});

const History = mongoose.model("History", historySchema);

export default History;
