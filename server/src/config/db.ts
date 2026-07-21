import mongoose from "mongoose";
import process from "process";
import dns from "dns";
dns.setServers(["8.8.8.8", "8.8.4.4"]);
export async function connectDB(): Promise<void> {
  const uri = process.env.MONGODB_URI;

  if (!uri) {
    throw new Error("MONGODB_URI is not defined in environment variables");
  }

  try {
    await mongoose.connect(uri);
    console.log("✅ MongoDB connected");
  } catch (error) {
    console.error("❌ MongoDB connection failed:", error);
    process.exit(1);
  }
}