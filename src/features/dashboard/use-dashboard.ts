"use client";

import { useBody } from "@/features/body/use-body";
import { useDailyLogs } from "@/features/daily-logs/use-daily-logs";
import { useFinances } from "@/features/finances/use-finances";
import { useFocus } from "@/features/focus/use-focus";
import { useInvestments } from "@/features/investments/use-investments";
import { useNutrition } from "@/features/nutrition/use-nutrition";
import { useTraining } from "@/features/training/use-training";
import { lastNDays, todayIso } from "@/lib/data/dates";
import { sum } from "@/lib/data/format";

export function useDashboard() {
  const dailyLogs = useDailyLogs();
  const nutrition = useNutrition();
  const training = useTraining();
  const body = useBody();
  const focus = useFocus();
  const finances = useFinances();
  const investments = useInvestments();

  const today = todayIso();
  const todayLog = dailyLogs.logs.find((log) => log.date === today);
  const todayMeals = nutrition.items.filter((entry) => entry.date === today);
  const todayTraining = training.items.filter(
    (session) => session.date === today,
  );
  const todayFocus = focus.items.filter((session) => session.date === today);
  const todayTransactions = finances.items.filter(
    (item) => item.date === today,
  );
  const latestBody = [...body.items].sort((a, b) =>
    b.date.localeCompare(a.date),
  )[0];

  const calories = sum(todayMeals.map((meal) => meal.calories));
  const protein = sum(todayMeals.map((meal) => meal.proteinG));
  const focusMinutes = sum(
    todayFocus.map((session) => session.durationMinutes),
  );
  const moneySpent = sum(todayTransactions.map((item) => item.amount));
  const portfolioValue = sum(
    investments.items.map((position) =>
      position.currentPrice ? position.currentPrice * position.quantity : 0,
    ),
  );

  const lifeScore = calculateLifeScore({
    sleepHours: todayLog?.sleepHours ?? null,
    calories,
    protein,
    trainedToday: todayTraining.length > 0,
    focusMinutes,
    moneySpent,
    hasBodyCheckin: Boolean(latestBody),
  });

  const priority = getPriority({
    protein,
    trainedToday: todayTraining.length > 0,
    sleepHours: todayLog?.sleepHours ?? null,
    moneySpent,
  });

  const weeklyTrend = lastNDays(7).map((date) => {
    const log = dailyLogs.logs.find((item) => item.date === date);
    const meals = nutrition.items.filter((item) => item.date === date);
    const focusSessions = focus.items.filter((item) => item.date === date);
    const trained = training.items.some((item) => item.date === date);

    return {
      day: new Date(`${date}T00:00:00`).toLocaleDateString("en-US", {
        weekday: "short",
      }),
      score: calculateLifeScore({
        sleepHours: log?.sleepHours ?? null,
        calories: sum(meals.map((meal) => meal.calories)),
        protein: sum(meals.map((meal) => meal.proteinG)),
        trainedToday: trained,
        focusMinutes: sum(
          focusSessions.map((session) => session.durationMinutes),
        ),
        moneySpent: sum(
          finances.items
            .filter((transaction) => transaction.date === date)
            .map((transaction) => transaction.amount),
        ),
        hasBodyCheckin: body.items.some((item) => item.date === date),
      }),
    };
  });

  const recentSignals = [
    todayLog?.sleepHours
      ? `Sleep logged at ${todayLog.sleepHours}h today.`
      : "Sleep is not logged today.",
    todayTraining.length > 0
      ? `${todayTraining.length} training session logged today.`
      : "No training session logged today.",
    focusMinutes > 0
      ? `${focusMinutes} focus minutes completed today.`
      : "No focus session logged today.",
  ];

  return {
    isLoaded:
      dailyLogs.isLoaded &&
      nutrition.isLoaded &&
      training.isLoaded &&
      body.isLoaded &&
      focus.isLoaded &&
      finances.isLoaded &&
      investments.isLoaded,
    lifeScore,
    priority,
    recentSignals,
    weeklyTrend,
    today: {
      calories,
      protein,
      trainingCount: todayTraining.length,
      sleepHours: todayLog?.sleepHours ?? null,
      bodyWeightKg: latestBody?.weightKg ?? todayLog?.bodyWeightKg ?? null,
      focusMinutes,
      moneySpent,
      portfolioValue,
    },
  };
}

function calculateLifeScore({
  sleepHours,
  calories,
  protein,
  trainedToday,
  focusMinutes,
  moneySpent,
  hasBodyCheckin,
}: {
  sleepHours: number | null;
  calories: number;
  protein: number;
  trainedToday: boolean;
  focusMinutes: number;
  moneySpent: number;
  hasBodyCheckin: boolean;
}) {
  let score = 45;
  if (sleepHours && sleepHours >= 7) score += 15;
  if (sleepHours && sleepHours < 6) score -= 8;
  if (calories > 0) score += 8;
  if (protein >= 120) score += 12;
  if (trainedToday) score += 10;
  if (focusMinutes >= 60) score += 10;
  if (moneySpent > 100) score -= 5;
  if (hasBodyCheckin) score += 3;
  return Math.max(0, Math.min(100, Math.round(score)));
}

function getPriority({
  protein,
  trainedToday,
  sleepHours,
  moneySpent,
}: {
  protein: number;
  trainedToday: boolean;
  sleepHours: number | null;
  moneySpent: number;
}) {
  if (sleepHours !== null && sleepHours < 6) {
    return "Prioritize recovery and keep training intensity controlled.";
  }

  if (protein < 120) {
    return "Add a high-protein meal to stabilize today's nutrition.";
  }

  if (!trainedToday) {
    return "Log a short training session or active recovery block.";
  }

  if (moneySpent > 100) {
    return "Review today's spending before adding new expenses.";
  }

  return "Keep execution simple: finish one focused block and log it.";
}
