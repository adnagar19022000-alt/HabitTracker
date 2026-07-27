import { useEffect, useState } from "react";
import { api, getErrorMessage } from "../api/client";
import type { Insight } from "../types";
import { toast } from "react-toastify";

export function Insights() {
  const [insights, setInsights] = useState<Insight[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isGenerating, setIsGenerating] = useState(false);

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
      const { data } = await api.post<Insight>("/api/insights/generate");
      // Add the shiny new insight to the top of the list!
      setInsights((prev) => [data, ...prev]);
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
        <h1 className="font-display text-2xl font-bold">Weekly Insights</h1>
        <button 
          onClick={handleGenerateInsight} 
          disabled={isGenerating}
          className="btn-primary flex items-center gap-2 shadow-sm"
        >
          {isGenerating ? "✨ AI is thinking..." : "✨ Generate AI Insight"}
        </button>
      </div>

      {insights.length === 0 ? (
        <div className="card text-center py-12">
          <p className="text-slate">No insights yet.</p>
          <p className="text-sm text-slate mt-2">Click the button above to have AI analyze your recent habits!</p>
        </div>
      ) : (
        <div className="space-y-6">
          {insights.map((insight) => (
            <div key={insight._id} className="card space-y-3 shadow-sm border-ink/5">
              <div className="flex items-center justify-between border-b border-ink/5 pb-2">
                <span className="text-xs font-semibold uppercase tracking-wider text-sun">
                  {insight.cadence} Review
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