"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * One-off script to promote an existing user to admin.
 * The user must already exist (sign up normally first via /api/auth/sign-up/email),
 * then run this script with their email to flip role: 'user' -> 'admin'.
 *
 * Usage:
 *   npx ts-node scripts/seed-admin.ts someone@example.com
 */
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const mongoose_1 = __importDefault(require("mongoose"));
async function promoteToAdmin(email) {
    const uri = process.env.MONGODB_URI;
    if (!uri) {
        throw new Error("MONGODB_URI is not defined in environment variables");
    }
    await mongoose_1.default.connect(uri);
    const db = mongoose_1.default.connection.db;
    if (!db) {
        throw new Error("Failed to get database handle");
    }
    const usersCollection = db.collection("user");
    const result = await usersCollection.updateOne({ email }, { $set: { role: "admin" } });
    if (result.matchedCount === 0) {
        console.error(`❌ No user found with email: ${email}`);
    }
    else {
        console.log(`✅ ${email} is now an admin`);
    }
    await mongoose_1.default.disconnect();
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
