interface MiniHeatmapProps {
  entries: { date: string; completed: boolean }[];
}

export function MiniHeatmap({ entries }: MiniHeatmapProps) {
  return (
    <div className="flex items-end gap-1">
      {entries.map((e) => (
        <div
          key={e.date}
          title={e.date}
          className={`h-4 w-1.5 rounded-sm ${e.completed ? "bg-moss" : "bg-ink/10"}`}
        />
      ))}
    </div>
  );
}