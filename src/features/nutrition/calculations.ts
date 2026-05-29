import type { NutritionEntry } from "@/lib/data/schemas";
import { lastNDays, todayIso } from "@/lib/data/dates";
import { sum } from "@/lib/data/format";

export function getNutritionSummary(
  entries: NutritionEntry[],
  date = todayIso(),
) {
  const dayEntries = entries.filter((entry) => entry.date === date);

  return {
    meals: dayEntries,
    totals: {
      calories: sum(dayEntries.map((entry) => entry.calories)),
      protein: sum(dayEntries.map((entry) => entry.proteinG)),
      carbs: sum(dayEntries.map((entry) => entry.carbsG)),
      fat: sum(dayEntries.map((entry) => entry.fatG)),
    },
    recentMeals: entries.slice(0, 8),
    weeklyCalories: lastNDays(7).map((day) => ({
      day: new Date(`${day}T00:00:00`).toLocaleDateString("en-US", {
        weekday: "short",
      }),
      score: sum(
        entries
          .filter((entry) => entry.date === day)
          .map((entry) => entry.calories),
      ),
    })),
    weeklyProtein: lastNDays(7).map((day) => ({
      day: new Date(`${day}T00:00:00`).toLocaleDateString("en-US", {
        weekday: "short",
      }),
      score: sum(
        entries
          .filter((entry) => entry.date === day)
          .map((entry) => entry.proteinG),
      ),
    })),
  };
}
