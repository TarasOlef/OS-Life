import type { TrainingSession, TrainingSet } from "@/lib/data/schemas";
import { average, sum } from "@/lib/data/format";
import { isThisWeek } from "@/lib/data/dates";

export function getTrainingSummary(sessions: TrainingSession[]) {
  const weeklySessions = sessions.filter((session) => isThisWeek(session.date));
  const weeklySets = weeklySessions.flatMap((session) => session.sets);
  const totalVolume = sum(
    weeklySets.map((set) => (set.reps ?? 0) * (set.weightKg ?? 0)),
  );
  const averageEffort = average(
    weeklySessions.map((session) => session.perceivedEffort),
  );

  return {
    latest: [...sessions].sort((a, b) => b.date.localeCompare(a.date))[0],
    weeklySessions,
    totalSets: weeklySets.length,
    totalVolume,
    averageEffort,
    prs: getMaxWeightByExercise(sessions.flatMap((session) => session.sets)),
  };
}

function getMaxWeightByExercise(sets: TrainingSet[]) {
  const maxByExercise = new Map<string, number>();

  for (const set of sets) {
    if (!set.weightKg) continue;
    const current = maxByExercise.get(set.exerciseName) ?? 0;
    if (set.weightKg > current) {
      maxByExercise.set(set.exerciseName, set.weightKg);
    }
  }

  return Array.from(maxByExercise, ([exercise, weight]) => ({
    exercise,
    weight,
  })).sort((a, b) => b.weight - a.weight);
}
