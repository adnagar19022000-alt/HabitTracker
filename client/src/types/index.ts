export interface TargetFrequency {
  type: 'daily' | 'daysOfWeek' | 'daysOfMonth' | 'timesPerPeriod';
  days?: number[];
  timesPerPeriod?: number;
  periodLength?: number;
}

export interface Reminder {
  enabled: boolean;
  time?: string;
}

export interface DayStripItem {
  date: string;       // "YYYY-MM-DD"
  dayName: string;    // "Mon"
  dayNumber: number;  // 15
  isToday: boolean;
  isSelected: boolean;
}

export interface MiniHeatmapItem {
  date: string;
  completed: boolean;
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
  miniHeatmap: MiniHeatmapItem[];
}

export interface DashboardStats {
  scheduledHabits: number;
  completedHabits: number;
  completionRate: number;
}

export interface DashboardData {
  selectedDate: string;
  dayStrip: DayStripItem[];
  stats: DashboardStats;
  habits: HabitCard[];
}

export interface User {
  id: string;
  email: string;
  name: string;
}