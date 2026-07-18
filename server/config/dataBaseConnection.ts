import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();

const connectDB = async (): Promise<void> => {
  if (!process.env.MONGO_URI) {
    console.error("❌ MONGO_URI not defined in .env file");
    process.exit(1);
  }

  try {
    const conn = await mongoose.connect(process.env.MONGO_URI);

    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);

    mongoose.connection.on("connected", () => {
      console.log("📡 Mongoose connected to DB");
    });

    mongoose.connection.on("error", (err: Error) => {
      console.error(`⚠️ Mongoose connection error: ${err.message}`);
    });

    mongoose.connection.on("disconnected", () => {
      console.warn("⚠️ Mongoose disconnected");
    });

    process.on("SIGINT", async () => {
      await mongoose.connection.close();
      console.log("🔴 MongoDB connection closed due to app termination");
      process.exit(0);
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    console.error(`❌ MongoDB Connection Failed: ${message}`);
    setTimeout(connectDB, 5000);
  }
};

export default connectDB;
