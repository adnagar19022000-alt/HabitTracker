import { useEffect, useState } from "react";
import { api, getErrorMessage } from "../../api/client";
import type { AdminStats as AdminStatsType } from "../../types";

export function AdminStats() {
  const [stats, setStats] = useState<AdminStatsType | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchStats() {
      try {
        const { data } = await api.get<AdminStatsType>("/api/admin/stats");
        setStats(data);
      } catch (err) {
        setError(getErrorMessage(err));
      } finally {
        setIsLoading(false);
      }
    }
    fetchStats();
  }, []);

  if (isLoading) {
    return <div className="text-center text-sm text-slate mt-8">Loading stats...</div>;
  }

  if (error) {
    return (
      <div className="rounded-md bg-clay/10 px-4 py-3 text-sm text-clay-dark">
        {error}
      </div>
    );
  }

  if (!stats) return null;

  return (
    <div className="space-y-6">
      <h2 className="text-lg font-semibold tracking-tight">Platform Overview</h2>
      
      {/* Top Metrics Row */}
      <div className="grid gap-4 sm:grid-cols-3">
        <div className="card">
          <p className="text-sm text-slate">Total Users</p>
          <p className="font-display text-3xl font-semibold mt-1">{stats.totalUsers}</p>
        </div>
        <div className="card">
          <p className="text-sm text-slate">Active Habits</p>
          <p className="font-display text-3xl font-semibold mt-1">{stats.totalHabits}</p>
        </div>
        <div className="card">
          <p className="text-sm text-slate">Platform Health (30d)</p>
          <p className="font-display text-3xl font-semibold mt-1">{stats.averageCompletionRate}%</p>
        </div>
      </div>

      {/* Popular Categories */}
      <div className="card space-y-4">
        <h3 className="font-medium">Popular Categories</h3>
        {stats.popularCategories.length === 0 ? (
          <p className="text-sm text-slate">No habits created yet.</p>
        ) : (
          <div className="space-y-3">
            {stats.popularCategories.map((cat) => (
              <div key={cat.category} className="flex items-center justify-between border-b border-ink/5 pb-2 last:border-0 last:pb-0">
                <span className="text-sm font-medium">{cat.category}</span>
                <span className="text-sm font-mono text-slate bg-clay/10 px-2 py-0.5 rounded-full">
                  {cat.count} {cat.count === 1 ? "habit" : "habits"}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}