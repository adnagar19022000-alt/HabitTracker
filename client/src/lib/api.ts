import type { DashboardData } from '../types';

const API_BASE = '/api';

/**
 * Fetch Home Dashboard data for a selected date key (YYYY-MM-DD)
 */
export async function fetchDashboardData(dateKey?: string): Promise<DashboardData> {
  const url = dateKey ? `${API_BASE}/dashboard?date=${dateKey}` : `${API_BASE}/dashboard`;
  const response = await fetch(url, {
    headers: {
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    throw new Error('Failed to fetch dashboard data');
  }

  return response.json();
}

/**
 * Create a new habit
 */
export async function createHabit(habitData: {
  title: string;
  category: string;
  icon: string;
  color: string;
  targetFrequency: {
    type: 'daily' | 'daysOfWeek' | 'daysOfMonth' | 'timesPerPeriod';
    days?: number[];
  };
  reminder?: {
    enabled: boolean;
    time?: string;
  };
}) {
  const response = await fetch(`${API_BASE}/habits`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(habitData),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.error?.message || 'Failed to create habit');
  }

  return response.json();
}

/**
 * Log a habit completion for a specific date
 */
export async function logHabitEntry(habitId: string, dateKey?: string) {
  const response = await fetch(`${API_BASE}/habits/${habitId}/entries`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ date: dateKey }),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.error?.message || 'Failed to log entry');
  }

  return response.json();
}

/**
 * Delete a habit entry
 */
export async function deleteHabitEntry(entryId: string) {
  const response = await fetch(`${API_BASE}/entries/${entryId}`, {
    method: 'DELETE',
  });

  if (!response.ok) {
    throw new Error('Failed to delete entry');
  }

  return response.json();
}