import "dotenv/config";
import mongoose from "mongoose";
import { MONGODB_URI } from "./config.js";

console.log("connecting to", MONGODB_URI);

const connectDB = () => {
  mongoose
    .connect(MONGODB_URI)
    .then(() => {
      console.log("connected to MongoDB");
    })
    .catch((error) => {
      console.log("error connection to MongoDB:", error.message);
    });
};

export default connectDB;
