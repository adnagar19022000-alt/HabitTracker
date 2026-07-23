import type { DayStripItem } from "../types";

interface DayStripProps {
  days: DayStripItem[];
  onSelect: (date: string) => void;
}

export function DayStrip({ days, onSelect }: DayStripProps) {
  return (
    <div className="flex items-stretch gap-1.5">
      {days.map((day) => (
        <button
          key={day.date}
          onClick={() => onSelect(day.date)}
          className={`flex flex-1 flex-col items-center gap-2 rounded-md border py-3 transition-colors ${
            day.isSelected
              ? "border-ink bg-ink text-paper"
              : day.isToday
              ? "border-clay/50 bg-clay/5 text-ink"
              : "border-ink/10 bg-white/30 text-ink/70 hover:border-ink/25"
          }`}
        >
          <span className="text-[11px] font-medium uppercase tracking-wide opacity-70">
            {day.dayName}
          </span>
          <span className="font-mono text-base font-semibold">{day.dayNumber}</span>
          {/* Tally tick — the signature mark, filled for today */}
          <span
            className={`h-3 w-px ${
              day.isSelected ? "bg-paper" : day.isToday ? "bg-clay" : "bg-ink/20"
            }`}
          />
        </button>
      ))}
    </div>
  );
}