"use client";

import { Flame, Trash2, Utensils } from "lucide-react";
import { AnimatedPress } from "@/components/app/animated";
import { Button } from "@/components/ui/button";
import type { NutritionEntry } from "@/lib/data/schemas";
import { MacroPill } from "@/features/nutrition/components/macro-pill";

type MealCardProps = {
  meal: NutritionEntry;
  onDelete: () => void;
};

export function MealCard({ meal, onDelete }: MealCardProps) {
  const time = new Date(meal.createdAt).toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
  });

  return (
    <AnimatedPress>
      <div className="flex gap-3 rounded-[1.75rem] bg-card p-3 shadow-[0_18px_55px_rgb(0_0_0/0.06)] dark:border dark:border-border/60 dark:shadow-none">
        <div className="flex size-24 shrink-0 items-center justify-center rounded-[1.35rem] bg-secondary/70">
          <Utensils
            className="size-8 text-muted-foreground"
            aria-hidden="true"
          />
        </div>
        <div className="min-w-0 flex-1 py-1">
          <div className="flex items-start justify-between gap-2">
            <div className="min-w-0">
              <p className="truncate text-lg font-semibold">
                {meal.mealName ?? "Meal"}
              </p>
              <p className="text-xs font-medium text-muted-foreground">
                {time}
              </p>
            </div>
            <Button
              type="button"
              variant="ghost"
              size="icon"
              onClick={onDelete}
              aria-label="Delete meal"
              className="size-9"
            >
              <Trash2 className="size-4" aria-hidden="true" />
            </Button>
          </div>
          <p className="mt-3 flex items-center gap-2 text-2xl font-semibold">
            <Flame className="size-5" aria-hidden="true" />
            {meal.calories ?? 0} kcal
          </p>
          <div className="mt-3 flex flex-wrap gap-2">
            <MacroPill label="P" value={meal.proteinG ?? 0} />
            <MacroPill label="C" value={meal.carbsG ?? 0} />
            <MacroPill label="F" value={meal.fatG ?? 0} />
          </div>
        </div>
      </div>
    </AnimatedPress>
  );
}
