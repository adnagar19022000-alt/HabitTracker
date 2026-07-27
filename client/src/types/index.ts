export type Role = "user" | "admin";

export interface User {
  id: string;
  name: string;
  email: string;
  role: Role;
  createdAt: string;
}

export type FrequencyType =
  | "daily"
  | "daysOfWeek"
  | "daysOfMonth"
  | "timesPerPeriod";

export interface TargetFrequency {
  type: FrequencyType;
  days?: number[];
  timesPerPeriod?: number;
  periodLength?: number;
}

export interface Reminder {
  enabled: boolean;
  time?: string;
}

export interface Streak {
  current: number;
  best: number;
}

export interface Habit {
  _id: string;
  userId: string;
  title: string;
  description?: string;
  category: string;
  icon: string;
  color: string;
  targetFrequency: TargetFrequency;
  reminder: Reminder;
  archived: boolean;
  createdAt: string;
  updatedAt: string;
  streak?: Streak; // present on GET /api/habits/:id only
}

export interface Entry {
  _id: string;
  habitId: string;
  userId: string;
  date: string;
  value?: number;
  note?: string;
  createdAt: string;
}

export interface DayStripItem {
  date: string;
  dayName: string;
  dayNumber: number;
  isToday: boolean;
  isSelected: boolean;
}

export interface HabitCard {
  id: string;
  title: string;
  description?: string;
  category: string;
  icon: string;
  color: string;
  targetFrequency: TargetFrequency;
  isScheduledOnSelectedDate: boolean;
  isCompletedOnSelectedDate: boolean;
  miniHeatmap: { date: string; completed: boolean }[];
}

export interface DashboardData {
  selectedDate: string;
  dayStrip: DayStripItem[];
  stats: {
    scheduledHabits: number;
    completedHabits: number;
    completionRate: number;
  };
  habits: HabitCard[];
}

export interface AdminUserListItem {
  id: string;
  name: string;
  email: string;
  role: Role;
  joinDate: string;
  habitCount: number;
}

export interface AdminStats {
  totalUsers: number;
  totalHabits: number;
  averageCompletionRate: number;
  popularCategories: { category: string; count: number }[];
}

export interface ApiErrorShape {
  error: { code: string; message: string };
}

export interface Insight {
  _id: string;
  periodStart: string;
  periodEnd: string;
  cadence: string;
  content: string;
  generatedAt: string;
}