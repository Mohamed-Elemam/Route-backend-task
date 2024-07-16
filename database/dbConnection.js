import { connect } from "mongoose";

const connectDB = async () => {
  try {
    await connect("mongodb://localhost:27017/backendTask", {});
    console.log("MongoDB connected");
  } catch (error) {
    console.error("MongoDB connection error:", error);
    process.exit(1);
  }
};

export default connectDB;
