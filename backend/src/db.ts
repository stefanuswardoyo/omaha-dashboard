import mongoose from "mongoose";

const connectDB = async (): Promise<void> => {
  try {
    await mongoose.connect(
      "mongodb+srv://stefanuswardoyo:UcfKqy1xjTvkWalI@tradingdashboard.m8j3qac.mongodb.net/"
    );
    console.log("Connected to MongoDB");
  } catch (error) {
    console.error("Failed to connect to MongoDB", error);
  }
};

export default connectDB;
