import type { FocusSession } from "@/lib/data/schemas";
import { lastNDays, todayIso } from "@/lib/data/dates";
import { average, sum } from "@/lib/data/format";

export function getFocusSummary(sessions: FocusSession[], date = todayIso()) {
  const weekDates = lastNDays(7);
  const weeklySessions = sessions.filter((session) =>
    weekDates.includes(session.date),
  );
  const todaySessions = sessions.filter((session) => session.date === date);

  return {
    todayMinutes: sum(todaySessions.map((session) => session.durationMinutes)),
    weeklyMinutes: sum(
      weeklySessions.map((session) => session.durationMinutes),
    ),
    averageQuality: average(
      weeklySessions.map((session) => session.qualityScore),
    ),
    topProject: getTopProject(weeklySessions),
    chartData: weekDates.map((day) => ({
      day: new Date(`${day}T00:00:00`).toLocaleDateString("en-US", {
        weekday: "short",
      }),
      score: sum(
        sessions
          .filter((session) => session.date === day)
          .map((session) => session.durationMinutes),
      ),
    })),
  };
}

function getTopProject(sessions: FocusSession[]) {
  const totals = new Map<string, number>();
  for (const session of sessions) {
    if (!session.project) continue;
    totals.set(
      session.project,
      (totals.get(session.project) ?? 0) + session.durationMinutes,
    );
  }
  return Array.from(totals, ([project, minutes]) => ({
    project,
    minutes,
  })).sort((a, b) => b.minutes - a.minutes)[0];
}
