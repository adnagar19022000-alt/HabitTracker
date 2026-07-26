import { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { api } from "../../api/client";
import { getHabit } from "../../api/habits";
import type { Habit, Entry } from "../../types";

export function HabitDetail() {
  // 1. Get the habit ID from the URL (e.g. /habits/abc123)
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  // 2. State to hold our data
  const [habit, setHabit] = useState<Habit | null>(null);
  const [entries, setEntries] = useState<Entry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // 3. Fetch data when the component loads
  useEffect(() => {
    async function loadData() {
      if (!id) return;
      try {
        setLoading(true);
        // Fetch BOTH the habit details and entry history at the same time
        const [habitData, entriesRes] = await Promise.all([
          getHabit(id),
          api.get<Entry[]>(`/api/habits/${id}/entries`),
        ]);
        
        setHabit(habitData);
        setEntries(entriesRes.data);
      } catch (err: any) {
        setError(err.response?.data?.error?.message || "Failed to load habit");
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, [id]);

  // 4. Handle deleting/archiving the habit
  async function handleArchive() {
    if (!window.confirm("Are you sure you want to archive this habit?")) return;
    
    try {
      await api.delete(`/api/habits/${id}`);
      navigate("/dashboard"); // Send user back to dashboard after archiving
    } catch (err) {
      alert("Failed to archive habit");
    }
  }

  // 5. Loading and Error states
  if (loading) return <div className="text-center py-10">Loading...</div>;
  if (error || !habit) return <div className="text-center py-10 text-clay-dark">{error || "Habit not found"}</div>;

  // 6. The main UI
  return (
    <div className="mx-auto max-w-2xl space-y-6">
      {/* Header Card (Icon, Title, Category, Edit/Archive Buttons) */}
      <div className="card flex items-center justify-between border-l-4" style={{ borderLeftColor: habit.color }}>
        <div className="flex items-center gap-4">
          <span className="text-4xl">{habit.icon}</span>
          <div>
            <h1 className="font-display text-2xl font-bold">{habit.title}</h1>
            <p className="text-sm text-slate capitalize">{habit.category}</p>
          </div>
        </div>
        <div className="flex gap-2">
          {/* Link automatically goes to /habits/:id/edit */}
          <Link to={`/habits/${habit._id}/edit`} className="btn-secondary">
            Edit
          </Link>
          <button 
            onClick={handleArchive} 
            className="btn-secondary text-clay-dark hover:bg-clay-dark/10 border-clay-dark/20"
          >
            Archive
          </button>
        </div>
      </div>

      {/* Description (Only shows if the user wrote one) */}
      {habit.description && (
        <div className="card">
          <h2 className="text-sm font-semibold text-slate mb-2">Description</h2>
          <p>{habit.description}</p>
        </div>
      )}

      {/* Streak Stats (Current vs Best) */}
      <div className="grid grid-cols-2 gap-4">
        <div className="card text-center">
          <h3 className="text-sm text-slate">Current Streak</h3>
          <p className="font-display text-3xl font-bold mt-1 text-leaf">{habit.streak?.current || 0} 🔥</p>
        </div>
        <div className="card text-center">
          <h3 className="text-sm text-slate">Best Streak</h3>
          <p className="font-display text-3xl font-bold mt-1 text-sun">{habit.streak?.best || 0} 🏆</p>
        </div>
      </div>

      {/* Entry History (List of completed dates) */}
      <div className="card">
        <h2 className="font-display text-lg font-semibold mb-4">History</h2>
        {entries.length === 0 ? (
          <p className="text-sm text-slate">No history yet. Complete this habit to start your streak!</p>
        ) : (
          <div className="space-y-3">
            {entries.map(entry => (
              <div key={entry._id} className="flex justify-between items-center border-b border-ink/5 pb-2 last:border-0">
                <div>
                  <span className="font-medium">{new Date(entry.date).toLocaleDateString()}</span>
                  {entry.note && <p className="text-sm text-slate mt-0.5">{entry.note}</p>}
                </div>
                <span className="text-leaf font-medium">Completed ✓</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}