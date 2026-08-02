import { useEffect, useState, useCallback } from "react";
import { Link } from "react-router-dom";
import { api, getErrorMessage } from "../api/client";
import type { DashboardData } from "../types";
import { DayStrip } from "../components/DayStrip";
import { MiniHeatmap } from "../components/MiniHeatmap";

export function Dashboard() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loggingId, setLoggingId] = useState<string | null>(null);

  const load = useCallback(async (date?: string) => {
    setError(null);
    try {
      const { data } = await api.get<DashboardData>("/api/dashboard", {
        params: date ? { date } : undefined,
      });
      setData(data);
    } catch (err) {
      setError(getErrorMessage(err));
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  async function quickLog(habitId: string) {
    setLoggingId(habitId);
    try {
      await api.post(`/api/habits/${habitId}/entries`, {
        date: data?.selectedDate,
      });
      await load(data?.selectedDate);
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setLoggingId(null);
    }
  }

  if (error) {
    return (
      <div className="rounded-md bg-clay/10 px-4 py-3 text-sm text-clay-dark">
        {error}
      </div>
    );
  }

  if (!data) {
    return <p className="font-mono text-sm text-slate">Loading…</p>;
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold tracking-tight">Dashboard</h1>
        <Link to="/habits/new" className="btn-primary">
          + Add habit
        </Link>
      </div>

      <DayStrip days={data.dayStrip} onSelect={(date) => load(date)} />

      <div className="card flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="text-sm text-slate">Today's completion</p>
          <p className="font-display text-3xl font-semibold">
            {data.stats.completionRate}%
          </p>
        </div>
        <p className="font-mono text-sm text-slate">
          {data.stats.completedHabits} / {data.stats.scheduledHabits} scheduled
        </p>
      </div>

      <div className="space-y-3">
        {data.habits.length === 0 && (
          <div className="card text-center text-sm text-slate">
            No habits yet. Add your first one to start your streak.
          </div>
        )}

        {data.habits.map((habit) => (
          <div key={habit.id} className="card flex flex-col sm:flex-row items-center justify-between gap-4">
            <Link to={`/habits/${habit.id}`} className="flex flex-1 items-center gap-4 w-full sm:w-auto overflow-hidden">
              <span
                className="flex h-10 w-10 items-center justify-center rounded-md text-lg"
                style={{ backgroundColor: `${habit.color}22` }}
              >
                {habit.icon}
              </span>
              <div className="flex-1">
                <p className="font-medium">{habit.title}</p>
                <p className="text-xs text-slate">{habit.category}</p>
              </div>
              <MiniHeatmap entries={habit.miniHeatmap} />
            </Link>

            {habit.isScheduledOnSelectedDate && (
              <button
                onClick={() => quickLog(habit.id)}
                disabled={habit.isCompletedOnSelectedDate || loggingId === habit.id}
                className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full border text-sm transition-colors ${
                  habit.isCompletedOnSelectedDate
                    ? "border-moss bg-moss text-paper"
                    : "border-ink/20 hover:border-moss hover:text-moss"
                }`}
                aria-label={habit.isCompletedOnSelectedDate ? "Completed" : "Mark done"}
              >
                {habit.isCompletedOnSelectedDate ? "✓" : ""}
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}