import type { BodyCheckin } from "@/lib/data/schemas";
import { isThisMonth, lastNDays } from "@/lib/data/dates";

export function getBodySummary(checkins: BodyCheckin[]) {
  const sorted = [...checkins].sort((a, b) => b.date.localeCompare(a.date));
  const latest = sorted[0];
  const previous = sorted[1];
  const weightChange =
    latest?.weightKg && previous?.weightKg
      ? latest.weightKg - previous.weightKg
      : null;

  return {
    latest,
    previous,
    weightChange,
    checkinsThisMonth: checkins.filter((checkin) => isThisMonth(checkin.date))
      .length,
    chartData: lastNDays(30).map((day) => ({
      day: new Date(`${day}T00:00:00`).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
      }),
      score: checkins.find((checkin) => checkin.date === day)?.weightKg ?? 0,
    })),
  };
}
