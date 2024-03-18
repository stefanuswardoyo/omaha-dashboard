import mongoose from "mongoose";

const adminSchema = new mongoose.Schema({
  Username: {
    type: String,
    required: true,
  },
  Password: {
    type: String,
    required: true,
  },
});

const Admin = mongoose.model("Admin", adminSchema);

export default Admin;
