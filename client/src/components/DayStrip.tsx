import { useEffect, useRef, useState, useId } from "react";
import type { DayStripItem } from "../types";

interface DayStripProps {
  days: DayStripItem[];
  onSelect: (date: string) => void;
}

/* ── Scoped styles for the carousel ── */
const carouselCSS = `
  .daystrip-container {
    display: flex;
    align-items: stretch;
    gap: 8px;
    overflow-x: auto;
    overflow-y: hidden;
    scroll-snap-type: x mandatory;
    position: relative;
    padding-bottom: 16px;
    -ms-overflow-style: none;
    scrollbar-width: none;
  }
  .daystrip-container::-webkit-scrollbar {
    display: none;
  }
  .daystrip-card {
    flex: none;
    width: calc((100% - 16px) / 3);
    scroll-snap-align: center;
  }
  @media (min-width: 768px) {
    .daystrip-card {
      flex: 1;
      width: auto;
    }
  }
`;

export function DayStrip({ days, onSelect }: DayStripProps) {
  const uniqueId = useId();
  const observerRef = useRef<HTMLDivElement>(null);
  const cardRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const match = entry.target.id.match(/\d+$/);
            if (match) {
              setActiveIndex(Number(match[0]));
            }
          }
        });
      },
      {
        root: observerRef.current,
        rootMargin: "0px",
        threshold: 1.0,
      }
    );

    cardRefs.current.forEach((cardRef) => {
      if (cardRef) observer.observe(cardRef);
    });

    return () => {
      observer.disconnect();
    };
  }, []);

  function handleIndicatorClick(index: number) {
    const item = cardRefs.current[index];
    const container = observerRef.current;
    if (item && container) {
      const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      container.scrollTo({
        left: item.offsetLeft,
        behavior: prefersReducedMotion ? "instant" : "smooth",
      });
    }
  }

  return (
    <div className="w-full relative">
      <style>{carouselCSS}</style>

      {/* Scrollable Carousel Container */}
      <div ref={observerRef} className="daystrip-container">
        {days.map((day, index) => (
          <button
            key={day.date}
            id={`${uniqueId}-day-${index}`}
            ref={(node) => {
              cardRefs.current[index] = node;
            }}
            onClick={() => onSelect(day.date)}
            className={`daystrip-card flex flex-col items-center gap-2 rounded-md border py-3 transition-colors ${
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

      {/* Indicator Dots — only visible on mobile where scrolling is active */}
      <nav aria-label="Day Navigation" className="flex justify-center md:hidden">
        <ul className="flex items-center gap-3">
          {days.map((_, index) => (
            <li key={index}>
              <button
                aria-label={`Navigate to day ${index + 1}`}
                onClick={() => handleIndicatorClick(index)}
                className={`block h-2 w-2 rounded-full transition-colors ${
                  activeIndex === index ? "bg-ink" : "bg-ink/20 hover:bg-ink/40"
                }`}
              />
            </li>
          ))}
        </ul>
      </nav>
    </div>
  );
}