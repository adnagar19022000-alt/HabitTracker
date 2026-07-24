import { api } from "./client";
import type { Habit, TargetFrequency, Reminder } from "../types";

export interface HabitPayload {
  title: string;
  description?: string;
  category: string;
  icon: string;
  color: string;
  targetFrequency: TargetFrequency;
  reminder: Reminder;
}

export async function createHabit(payload: HabitPayload): Promise<Habit> {
  const res = await api.post<Habit>("/api/habits", payload);
  return res.data;
}

export async function updateHabit(
  id: string,
  payload: Partial<HabitPayload>
): Promise<Habit> {
  const res = await api.patch<Habit>(`/api/habits/${id}`, payload);
  return res.data;
}

export async function getHabit(id: string): Promise<Habit> {
  const res = await api.get<Habit>(`/api/habits/${id}`);
  return res.data;
}