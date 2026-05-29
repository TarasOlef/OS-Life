export function calculateLifeScore(input: {
  sleepHours: number | null;
  protein: number;
  calories: number;
  trainedToday: boolean;
  focusMinutes: number;
  moneySpent: number;
  hasBodyCheckinThisWeek: boolean;
}) {
  const sleepScore = input.sleepHours
    ? input.sleepHours >= 7 && input.sleepHours <= 9
      ? 18
      : input.sleepHours >= 6
        ? 12
        : 4
    : 0;
  const nutritionScore =
    input.calories > 0 ? 8 + Math.min(12, Math.round(input.protein / 10)) : 0;
  const trainingScore = input.trainedToday ? 18 : 0;
  const focusScore = Math.min(18, Math.round(input.focusMinutes / 5));
  const financeScore = input.moneySpent <= 100 ? 14 : 8;
  const bodyScore = input.hasBodyCheckinThisWeek ? 10 : 0;

  return Math.max(
    0,
    Math.min(
      100,
      sleepScore +
        nutritionScore +
        trainingScore +
        focusScore +
        financeScore +
        bodyScore,
    ),
  );
}

export function getDashboardPriority(input: {
  protein: number;
  trainedToday: boolean;
  sleepHours: number | null;
  moneySpent: number;
  hasBodyCheckinThisWeek: boolean;
}) {
  if (input.protein < 120) return "Hit your protein target.";
  if (!input.trainedToday) return "Log your workout.";
  if (input.sleepHours !== null && input.sleepHours < 7) {
    return "Protect recovery tonight.";
  }
  if (input.moneySpent > 100) return "Control spending today.";
  if (!input.hasBodyCheckinThisWeek) return "Log your body check-in.";
  return "Keep the day simple: finish one focused block.";
}
