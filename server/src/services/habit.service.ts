import { Habit, IHabit } from "../models/habit.model";

export async function createHabit(
  userId: string,
  data: Partial<IHabit>
): Promise<IHabit> {
  return Habit.create({ ...data, userId });
}

export async function listHabits(userId: string): Promise<IHabit[]> {
  return Habit.find({ userId, archived: false });
}

export async function getHabitById(
  userId: string,
  habitId: string
): Promise<IHabit | null> {
  return Habit.findOne({ _id: habitId, userId });
}

export async function updateHabit(
  userId: string,
  habitId: string,
  data: Partial<IHabit>
): Promise<IHabit | null> {
  return Habit.findOneAndUpdate(
    { _id: habitId, userId },
    { $set: data },
    { new: true }
  );
}

export async function archiveHabit(
  userId: string,
  habitId: string
): Promise<IHabit | null> {
  return Habit.findOneAndUpdate(
    { _id: habitId, userId },
    { $set: { archived: true } },
    { new: true }
  );
}