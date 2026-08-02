import { useEffect, useState } from "react";
import { api, getErrorMessage } from "../api/client";
import type { Insight } from "../types";
import { toast } from "react-toastify";

type Cadence = "daily" | "weekly" | "monthly" | "custom";

export function Insights() {
  const [insights, setInsights] = useState<Insight[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isGenerating, setIsGenerating] = useState(false);
  const [selectedCadence, setSelectedCadence] = useState<Cadence>("weekly");
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
    if (selectedCadence === "custom" && !customPrompt.trim()) {
      toast.error("Please type a question first!");
      return;
    }

    setIsGenerating(true);
    try {
      const body: { cadence: Cadence; customPrompt?: string } = {
        cadence: selectedCadence,
      };
      if (selectedCadence === "custom") {
        body.customPrompt = customPrompt.trim();
      }

      const { data } = await api.post<Insight>("/api/insights/generate", body);
      setInsights((prev) => [data, ...prev]);
      toast.success("AI Insight generated successfully! ✨");
      setCustomPrompt(""); // Clear the input after success
    } catch (err) {
      toast.error(getErrorMessage(err));
    } finally {
      setIsGenerating(false);
    }
  }

  if (isLoading) {
    return <div className="text-center text-sm text-slate mt-10">Loading your insights...</div>;
  }

  const cadenceOptions: { value: Cadence; label: string; emoji: string }[] = [
    { value: "daily", label: "Daily", emoji: "📅" },
    { value: "weekly", label: "Weekly", emoji: "📊" },
    { value: "monthly", label: "Monthly", emoji: "📈" },
    { value: "custom", label: "Ask AI", emoji: "💬" },
  ];

  return (
    <div className="mx-auto max-w-2xl space-y-8">
      <h1 className="font-display text-2xl font-bold">AI Habit Coach</h1>

      {/* Cadence Selector */}
      <div className="card space-y-4">
        <p className="text-sm font-medium text-slate">Choose insight type:</p>
        <div className="flex flex-wrap gap-2">
          {cadenceOptions.map((option) => (
            <button
              key={option.value}
              onClick={() => setSelectedCadence(option.value)}
              className={`flex items-center gap-2 rounded-lg border px-4 py-2 text-sm font-medium transition-colors ${
                selectedCadence === option.value
                  ? "border-ink bg-ink text-paper"
                  : "border-ink/15 bg-white/50 text-ink/70 hover:border-ink/30"
              }`}
            >
              <span>{option.emoji}</span>
              {option.label}
            </button>
          ))}
        </div>

        {/* Custom Prompt Input — only shows when "Ask AI" is selected */}
        {selectedCadence === "custom" && (
          <div className="space-y-2">
            <label className="field-label">Ask a question about your habits:</label>
            <input
              type="text"
              className="field-input"
              placeholder="e.g. Which habit am I most consistent with?"
              value={customPrompt}
              onChange={(e) => setCustomPrompt(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !isGenerating) handleGenerateInsight();
              }}
            />
          </div>
        )}

        <button
          onClick={handleGenerateInsight}
          disabled={isGenerating}
          className="btn-primary flex items-center gap-2 shadow-sm w-full justify-center"
        >
          {isGenerating
            ? "✨ AI is thinking..."
            : selectedCadence === "custom"
            ? "💬 Ask AI Coach"
            : `✨ Generate ${selectedCadence.charAt(0).toUpperCase() + selectedCadence.slice(1)} Insight`}
        </button>
      </div>

      {/* Past Insights */}
      {insights.length === 0 ? (
        <div className="card text-center py-12">
          <p className="text-slate">No insights yet.</p>
          <p className="text-sm text-slate mt-2">
            Select a time period above and let AI analyze your habits!
          </p>
        </div>
      ) : (
        <div className="space-y-6">
          {insights.map((insight) => (
            <div key={insight._id} className="card space-y-3 shadow-sm border-ink/5">
              <div className="flex items-center justify-between border-b border-ink/5 pb-2">
                <span
                  className={`text-xs font-semibold uppercase tracking-wider ${
                    insight.cadence === "custom"
                      ? "text-sky-500"
                      : insight.cadence === "daily"
                      ? "text-leaf"
                      : insight.cadence === "monthly"
                      ? "text-clay"
                      : "text-sun"
                  }`}
                >
                  {insight.cadence === "custom" ? "💬 Q&A" : `${insight.cadence} Review`}
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