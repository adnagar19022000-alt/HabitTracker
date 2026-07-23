/**
 * One-off script to promote an existing user to admin.
 * The user must already exist (sign up normally first via /api/auth/sign-up/email),
 * then run this script with their email to flip role: 'user' -> 'admin'.
 *
 * Usage:
 *   npx ts-node scripts/seed-admin.ts someone@example.com
 */
import dotenv from "dotenv";
dotenv.config();

import mongoose from "mongoose";

async function promoteToAdmin(email: string) {
  const uri = process.env.MONGODB_URI;
  if (!uri) {
    throw new Error("MONGODB_URI is not defined in environment variables");
  }

  await mongoose.connect(uri);
  const db = mongoose.connection.db;
  if (!db) {
    throw new Error("Failed to get database handle");
  }

  const usersCollection = db.collection("user");

  const result = await usersCollection.updateOne(
    { email },
    { $set: { role: "admin" } }
  );

  if (result.matchedCount === 0) {
    console.error(`❌ No user found with email: ${email}`);
  } else {
    console.log(`✅ ${email} is now an admin`);
  }

  await mongoose.disconnect();
}

const email = process.argv[2];
if (!email) {
  console.error("Usage: npx ts-node scripts/seed-admin.ts <email>");
  process.exit(1);
}

promoteToAdmin(email)
  .then(() => process.exit(0))
  .catch((err) => {
    console.error(err);
    process.exit(1);
  });