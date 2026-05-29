"use client";

import { cn } from "@/lib/utils";
import type { NutritionEntry } from "@/lib/data/schemas";

type WeekStripProps = {
  days: string[];
  selectedDate: string;
  entries: NutritionEntry[];
  onSelect: (date: string) => void;
};

export function WeekStrip({
  days,
  selectedDate,
  entries,
  onSelect,
}: WeekStripProps) {
  return (
    <div className="-mx-1 flex gap-2 overflow-x-auto px-1 pb-1">
      {days.map((date) => {
        const day = new Date(`${date}T00:00:00`);
        const isSelected = date === selectedDate;
        const hasEntries = entries.some((entry) => entry.date === date);

        return (
          <button
            key={date}
            type="button"
            onClick={() => onSelect(date)}
            className={cn(
              "flex min-w-14 flex-col items-center gap-2 rounded-3xl px-2 py-2 text-center transition-all active:scale-95",
              isSelected
                ? "bg-foreground text-background shadow-sm"
                : "text-foreground",
            )}
          >
            <span
              className={cn(
                "flex size-10 items-center justify-center rounded-full border text-sm font-semibold",
                isSelected
                  ? "border-background/20"
                  : hasEntries
                    ? "border-emerald-400 text-emerald-500 dark:text-emerald-300"
                    : "border-border text-muted-foreground",
              )}
            >
              {day.toLocaleDateString("en-US", { weekday: "narrow" })}
            </span>
            <span className="text-lg font-semibold leading-none">
              {day.getDate()}
            </span>
          </button>
        );
      })}
    </div>
  );
}
