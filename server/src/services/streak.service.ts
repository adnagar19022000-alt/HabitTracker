import { IHabit } from "../models/habit.model";
import { Entry } from "../models/entry.model";

/**
 * Determines if a given date is a target day for the habit based on its frequency setting.
 */
export function isTargetDay(habit: IHabit, date: Date): boolean {
  const { type, days } = habit.targetFrequency;

  switch (type) {
    case "daily":
      return true;
    case "daysOfWeek":
      return days?.includes(date.getDay()) ?? false;
    case "daysOfMonth":
      return days?.includes(date.getDate()) ?? false;
    case "timesPerPeriod":
      return true;
    default:
      return false;
  }
}

/**
 * Formats a Date object into a YYYY-MM-DD string key.
 */
export function formatDateKey(date: Date): string {
  const d = new Date(date);
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

/**
 * Calculates current and best streaks for a given habit.
 */
export async function calculateStreak(
  habit: IHabit
): Promise<{ current: number; best: number }> {
  const entries = await Entry.find({ habitId: (habit as any)._id });
  const entryDates = new Set(entries.map((e) => e.date.getTime()));

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const habitStart = new Date(habit.createdAt || 0);
  habitStart.setHours(0, 0, 0, 0);

  let current = 0;
  let best = 0;
  let running = 0;
  let streakBroken = false;

  const cursor = new Date(today);

  while (cursor >= habitStart) {
    const isToday = cursor.getTime() === today.getTime();
    const targetDay = isTargetDay(habit, cursor);

    if (targetDay) {
      const hasEntry = entryDates.has(cursor.getTime());

      if (hasEntry) {
        running++;
        if (!streakBroken) current = running;
        best = Math.max(best, running);
      } else if (isToday) {
        // Today is a target day but not logged yet — streak is active
      } else {
        running = 0;
        streakBroken = true;
      }
    }

    cursor.setDate(cursor.getDate() - 1);
  }

  return { current, best };
}