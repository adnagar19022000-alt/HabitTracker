import { Entry, IEntry } from "../models/entry.model";
import { Habit } from "../models/habit.model";

export async function logEntry(
  userId: string,
  habitId: string,
  data: { date?: Date; value?: number; note?: string }
): Promise<IEntry> {
  // Confirm the habit exists AND belongs to this user before logging against it
  const habit = await Habit.findOne({ _id: habitId, userId });
  if (!habit) {
    throw new Error("HABIT_NOT_FOUND");
  }

  return Entry.create({
    userId,
    habitId,
    date: data.date ?? new Date(),
    value: data.value,
    note: data.note,
  });
}

export async function getEntriesForHabit(
  userId: string,
  habitId: string
): Promise<IEntry[]> {
  return Entry.find({ userId, habitId }).sort({ date: -1 });
}

export async function deleteEntry(
  userId: string,
  entryId: string
): Promise<IEntry | null> {
  return Entry.findOneAndDelete({ _id: entryId, userId });
}