import mongoose from "mongoose";
import * as dotenv from "dotenv";
import path from "path";

// Load .env from the server root
dotenv.config({ path: path.join(__dirname, "../.env") });

async function makeAdmin() {
  const uri = process.env.MONGODB_URI;
  if (!uri) {
    throw new Error("No MONGODB_URI found in .env");
  }

  console.log("Connecting to MongoDB...");
  await mongoose.connect(uri);
  
  const email = "aditya@gmail.com";
  console.log(`Looking for user: ${email}`);

  // Better-auth uses the "user" collection. 
  // We'll update it directly to avoid schema strictness issues.
  const result = await mongoose.connection.collection("user").updateOne(
    { email: email },
    { $set: { role: "admin" } }
  );

  if (result.matchedCount > 0) {
    console.log(`Successfully made ${email} an admin!`);
  } else {
    console.log(`User ${email} not found. Are you sure they are registered?`);
  }
  
  await mongoose.disconnect();
  console.log("Done.");
}

makeAdmin().catch(console.error);
