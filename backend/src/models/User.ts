// models/User.js
import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  Username: {
    type: String,
    required: true,
  },
  Password: {
    type: String,
    required: true,
  },
  AccountNumber: {
    type: String,
    required: true,
  },
});

const User = mongoose.model("User", userSchema);

export default User;
