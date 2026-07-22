import mongoose, { Schema, Document } from "mongoose";

export interface IHabit extends Document {
  userId: string;
  title: string;
  description?: string;
  category: string;
  icon: string;
  color: string;
  targetFrequency: {
    type: "daily" | "daysOfWeek" | "daysOfMonth" | "timesPerPeriod";
    days?: number[];
    timesPerPeriod?: number;
    periodLength?: number;
  };
  reminder: {
    enabled: boolean;
    time?: string;
  };
  archived: boolean;
}

const habitSchema = new Schema<IHabit>(
  {
    userId: { type: String, required: true, index: true },
    title: { type: String, required: true, trim: true },
    description: { type: String, trim: true },
    category: { type: String, required: true, trim: true },
    icon: { type: String, default: "⭐" },
    color: { type: String, default: "#3498db" },
    targetFrequency: {
      type: {
        type: String,
        enum: ["daily", "daysOfWeek", "daysOfMonth", "timesPerPeriod"],
        required: true,
        default: "daily",
      },
      days: { type: [Number], default: undefined },
      timesPerPeriod: Number,
      periodLength: Number,
    },
    reminder: {
      enabled: { type: Boolean, default: false },
      time: String,
    },
    archived: { type: Boolean, default: false },
  },
  { timestamps: true }
);

export const Habit = mongoose.model<IHabit>("Habit", habitSchema);