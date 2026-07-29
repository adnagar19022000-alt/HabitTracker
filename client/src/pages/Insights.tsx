import { useEffect, useState } from "react";
import { api, getErrorMessage } from "../api/client";
import type { Insight } from "../types";
import { toast } from "react-toastify";

export function Insights() {
  const [insights, setInsights] = useState<Insight[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isGenerating, setIsGenerating] = useState(false);
  
  // New state variables for advanced AI
  const [cadence, setCadence] = useState<"daily" | "weekly" | "monthly">("weekly");
  const [customPrompt, setCustomPrompt] = useState("");

  // Fetch past insights when the page loads
  useEffect(() => {
    async function fetchInsights() {
      try {
        const { data } = await api.get<Insight[]>("/api/insights");
        setInsights(data);
      } catch (err) {
        toast.error("Failed to load insights: " + getErrorMessage(err));
      } finally {
        setIsLoading(false);
      }
    }
    fetchInsights();
  }, []);

  // Function to trigger the AI
  async function handleGenerateInsight() {
    setIsGenerating(true);
    try {
      // Send the cadence and custom prompt in the request body
      const { data } = await api.post<Insight>("/api/insights/generate", {
        cadence: customPrompt ? "custom" : cadence, 
        customPrompt 
      });
      
      // Add the shiny new insight to the top of the list!
      setInsights((prev) => [data, ...prev]);
      setCustomPrompt(""); // clear the chat box
      toast.success("AI Insight generated successfully! ✨");
    } catch (err) {
      toast.error(getErrorMessage(err));
    } finally {
      setIsGenerating(false);
    }
  }

  if (isLoading) {
    return <div className="text-center text-sm text-slate mt-10">Loading your insights...</div>;
  }

  return (
    <div className="mx-auto max-w-2xl space-y-8">
      <div className="flex items-center justify-between">
        <h1 className="font-display text-2xl font-bold">AI Habit Coach</h1>
      </div>

      {/* --- Advanced AI Controls --- */}
      <div className="card space-y-4 bg-ink/5 border-none">
        <div className="flex items-center gap-4">
          <label className="text-sm font-medium text-ink">Analyze my last:</label>
          <select 
            className="field-input !py-1 !px-2 w-auto inline-block bg-paper"
            value={cadence}
            onChange={(e) => setCadence(e.target.value as any)}
            disabled={isGenerating}
          >
            <option value="daily">1 Day (Daily)</option>
            <option value="weekly">7 Days (Weekly)</option>
            <option value="monthly">30 Days (Monthly)</option>
          </select>
          <span className="text-sm text-slate flex-1">of habit data</span>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-ink">Ask a specific question (optional):</label>
          <textarea 
            className="field-input bg-paper" 
            rows={2} 
            placeholder="e.g., Why am I struggling with my gym habit this week? How can I improve?"
            value={customPrompt}
            onChange={(e) => setCustomPrompt(e.target.value)}
            disabled={isGenerating}
          />
        </div>

        <div className="flex justify-end pt-2">
          <button 
            onClick={handleGenerateInsight} 
            disabled={isGenerating}
            className="btn-primary flex items-center gap-2 shadow-sm"
          >
            {isGenerating ? "✨ AI is thinking..." : "✨ Ask AI Coach"}
          </button>
        </div>
      </div>

      {insights.length === 0 ? (
        <div className="card text-center py-12">
          <p className="text-slate">No insights yet.</p>
          <p className="text-sm text-slate mt-2">Use the controls above to talk to your AI Coach!</p>
        </div>
      ) : (
        <div className="space-y-6">
          {insights.map((insight) => (
            <div key={insight._id} className="card space-y-3 shadow-sm border-ink/5">
              <div className="flex items-center justify-between border-b border-ink/5 pb-2">
                <span className="text-xs font-semibold uppercase tracking-wider text-sun">
                  {insight.cadence} Insight
                </span>
                <span className="text-xs text-slate">
                  {new Date(insight.generatedAt).toLocaleDateString()}
                </span>
              </div>
              <div className="whitespace-pre-line text-sm leading-relaxed text-ink/90">
                {insight.content}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}