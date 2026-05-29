import type { DailyLog } from "@/lib/data/schemas";
import { average } from "@/lib/data/format";
import { lastNDays, todayIso } from "@/lib/data/dates";

export function getSleepSummary(logs: DailyLog[], date = todayIso()) {
  const weekDates = lastNDays(7);
  const weekly = weekDates
    .map((day) => logs.find((log) => log.date === day))
    .filter((log): log is DailyLog => Boolean(log?.sleepHours));
  const today = logs.find((log) => log.date === date);
  const best = [...weekly].sort(
    (a, b) => (b.sleepHours ?? 0) - (a.sleepHours ?? 0),
  )[0];
  const worst = [...weekly].sort(
    (a, b) => (a.sleepHours ?? 0) - (b.sleepHours ?? 0),
  )[0];
  const lastNightSleep = today?.sleepHours ?? null;

  return {
    lastNightSleep,
    weeklyAverageSleep: average(weekly.map((log) => log.sleepHours)),
    weeklyAverageQuality: average(weekly.map((log) => log.sleepQuality)),
    best,
    worst,
    recoveryMessage: getRecoveryMessage(lastNightSleep),
    chartData: weekDates.map((day) => ({
      day: new Date(`${day}T00:00:00`).toLocaleDateString("en-US", {
        weekday: "short",
      }),
      score: logs.find((log) => log.date === day)?.sleepHours ?? 0,
    })),
  };
}

function getRecoveryMessage(hours: number | null) {
  if (hours === null) return "Log sleep to calculate recovery.";
  if (hours < 6) return "Poor recovery. Protect sleep tonight.";
  if (hours < 7) return "Acceptable, but improve sleep duration.";
  if (hours <= 9) return "Solid recovery window.";
  return "Long sleep logged. Check consistency.";
}
