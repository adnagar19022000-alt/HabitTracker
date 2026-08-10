import mongoose, { Schema, Document } from "mongoose";
export interface IEntry extends Document {
  habitId: string;
  userId: string;
  date: Date;
  value?: number;
  note?: string;
  createdAt: Date;
}

const entrySchema = new Schema<IEntry>({
  habitId: {
    type: String,
    required: true,
    index: true,
  },
  userId: {
    type: String,
    required: true,
    index: true,
  },
  date: {
    type: Date,
    required: true,
  },
  value: {
    type: Number,
  },
  note: {
    type: String,
    trim: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// Compound unique index — prevents duplicate same-day logs for the same habit
entrySchema.index({ userId: 1, habitId: 1, date: 1 }, { unique: true });
entrySchema.pre("save", function () {
  this.date.setHours(0, 0, 0, 0);
});
export const Entry = mongoose.model<IEntry>("Entry", entrySchema);