import mongoose, { Schema, Document } from "mongoose";

export interface IInsight extends Document {
  userId: string;
  periodStart: Date;
  periodEnd: Date;
  cadence: "daily" | "weekly" | "monthly" | "custom";
  content: string;
  generatedAt: Date;
}

const insightSchema = new Schema<IInsight>({
  userId: { type: String, required: true, index: true },
  periodStart: { type: Date, required: true },
  periodEnd: { type: Date, required: true },
  cadence: {
    type: String,
    enum: ["daily", "weekly", "monthly", "custom"],
    default: "weekly",
    required: true,
  },
  content: { type: String, required: true },
  generatedAt: { type: Date, default: Date.now },
});

export const Insight = mongoose.model<IInsight>("Insight", insightSchema);