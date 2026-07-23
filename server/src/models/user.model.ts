import mongoose, { Schema, Document } from "mongoose";

// This does NOT own user data — Better Auth manages the `user` collection
// via its own MongoDB adapter. This model exists only so admin endpoints
// can query/list/filter that collection with Mongoose's query helpers.
// Do not use this model to create or mutate users — go through
// `auth.api.*` (see auth.controller.ts) so Better Auth's own logic
// (hashing, account linking, etc.) stays intact.
export interface IUser extends Document {
  name: string;
  email: string;
  role: "user" | "admin";
  createdAt: Date;
}

const userSchema = new Schema<IUser>(
  {
    name: String,
    email: String,
    role: { type: String, enum: ["user", "admin"], default: "user" },
    createdAt: Date,
  },
  { collection: "user", strict: false } // strict:false — Better Auth owns the real schema
);

export const AdminUserView = mongoose.model<IUser>("AdminUserView", userSchema);