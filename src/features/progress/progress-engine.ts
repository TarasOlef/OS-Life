import type {
  BodyCheckin,
  DailyLog,
  FinanceTransaction,
  FocusSession,
  InvestmentPosition,
  NutritionEntry,
  TrainingSession,
} from "@/lib/data/schemas";
import { isThisMonth, isThisWeek, todayIso } from "@/lib/data/dates";
import { average, sum } from "@/lib/data/format";
import type { BusinessLog } from "@/features/business/schemas";
import type {
  DashboardPriority,
  DomainProgress,
  DomainTargets,
  GoalProgress,
  LocalProgressData,
  ProgressDomain,
  ProgressStatus,
} from "@/features/progress/types";

function clampPercent(value: number) {
  if (!Number.isFinite(value)) return 0;
  return Math.max(0, Math.min(100, Math.round(value)));
}

function statusFromProgress(
  percent: number,
  hasLog: boolean,
  overLimit = false,
): ProgressStatus {
  if (overLimit) return "over_limit";
  if (!hasLog) return "needs_log";
  if (percent >= 100) return "complete";
  if (percent >= 70) return "on_track";
  if (percent > 0) return "behind";
  return "not_started";
}

function progressCard(input: {
  domain: ProgressDomain;
  label: string;
  currentValue: number;
  targetValue: number | null;
  unit: string;
  progressPercent: number;
  status: ProgressStatus;
  nextAction: string;
}): DomainProgress {
  return {
    ...input,
    progressPercent: clampPercent(input.progressPercent),
    updatedAt: new Date().toISOString(),
  };
}

export function calculateNutritionProgress(
  nutritionEntries: NutritionEntry[],
  targets: DomainTargets,
): DomainProgress {
  const today = todayIso();
  const meals = nutritionEntries.filter((entry) => entry.date === today);
  const protein = sum(meals.map((meal) => meal.proteinG));
  const calories = sum(meals.map((meal) => meal.calories));
  const proteinTarget = targets.nutrition.proteinGPerDay;
  const calorieTarget = targets.nutrition.caloriesPerDay;
  const target = proteinTarget ?? calorieTarget;
  const current = proteinTarget ? protein : calories;
  const percent = target
    ? (current / target) * 100
    : meals.length > 0
      ? 100
      : 0;

  return progressCard({
    domain: "nutrition",
    label: "Nutrition",
    currentValue: current,
    targetValue: target,
    unit: proteinTarget ? "g" : "kcal",
    progressPercent: percent,
    status: statusFromProgress(percent, meals.length > 0),
    nextAction:
      proteinTarget && protein < proteinTarget ? "Add protein" : "Add meal",
  });
}

export function calculateTrainingProgress(
  trainingSessions: TrainingSession[],
  targets: DomainTargets,
): DomainProgress {
  const weeklySessions = trainingSessions.filter((session) =>
    isThisWeek(session.date),
  );
  const target = targets.training.sessionsPerWeek;
  const percent = target > 0 ? (weeklySessions.length / target) * 100 : 0;

  return progressCard({
    domain: "training",
    label: "Training",
    currentValue: weeklySessions.length,
    targetValue: target,
    unit: "x",
    progressPercent: percent,
    status: statusFromProgress(percent, weeklySessions.length > 0),
    nextAction: weeklySessions.length >= target ? "Recover" : "Log workout",
  });
}

export function calculateSleepProgress(
  dailyLogs: DailyLog[],
  targets: DomainTargets,
): DomainProgress {
  const todayLog = dailyLogs.find((log) => log.date === todayIso());
  const sleepHours = todayLog?.sleepHours ?? 0;
  const target = targets.sleep.hoursPerNight;
  const percent = target > 0 ? (sleepHours / target) * 100 : 0;

  return progressCard({
    domain: "sleep",
    label: "Sleep",
    currentValue: sleepHours,
    targetValue: target,
    unit: "h",
    progressPercent: percent,
    status: statusFromProgress(percent, Boolean(todayLog?.sleepHours)),
    nextAction: sleepHours >= target ? "Keep rhythm" : "Protect sleep",
  });
}

export function calculateBodyProgress(
  bodyCheckins: BodyCheckin[],
  targets: DomainTargets,
): DomainProgress {
  const latest = [...bodyCheckins].sort((a, b) =>
    b.date.localeCompare(a.date),
  )[0];
  const current = latest?.weightKg ?? targets.body.currentWeightKg ?? 0;
  const target = targets.body.targetWeightKg;
  const start = targets.body.currentWeightKg;
  const hasCheckin = bodyCheckins.some((item) => isThisWeek(item.date));
  let percent = hasCheckin ? 100 : 0;

  if (target && start && current) {
    const totalDistance = Math.abs(start - target);
    const remaining = Math.abs(current - target);
    percent =
      totalDistance === 0
        ? 100
        : ((totalDistance - remaining) / totalDistance) * 100;
  }

  return progressCard({
    domain: "body",
    label: "Body",
    currentValue: current,
    targetValue: target,
    unit: "kg",
    progressPercent: percent,
    status: statusFromProgress(percent, hasCheckin),
    nextAction: hasCheckin ? "Review trend" : "Log check-in",
  });
}

export function calculateFocusProgress(
  focusSessions: FocusSession[],
  targets: DomainTargets,
): DomainProgress {
  const today = todayIso();
  const minutes = sum(
    focusSessions
      .filter((session) => session.date === today)
      .map((session) => session.durationMinutes),
  );
  const target = targets.focus.minutesPerDay;
  const percent = target > 0 ? (minutes / target) * 100 : 0;

  return progressCard({
    domain: "focus",
    label: "Focus",
    currentValue: minutes,
    targetValue: target,
    unit: "m",
    progressPercent: percent,
    status: statusFromProgress(percent, minutes > 0),
    nextAction: minutes >= target ? "Close loops" : "Start focus block",
  });
}

export function calculateMoneyProgress(
  financeTransactions: FinanceTransaction[],
  targets: DomainTargets,
): DomainProgress {
  const spend = sum(
    financeTransactions
      .filter((transaction) => isThisMonth(transaction.date))
      .map((transaction) => transaction.amount),
  );
  const limit = targets.money.monthlySpendingLimit;
  const percent = limit ? (1 - spend / limit) * 100 : spend > 0 ? 50 : 0;
  const overLimit = Boolean(limit && spend > limit);

  return progressCard({
    domain: "money",
    label: "Money",
    currentValue: spend,
    targetValue: limit,
    unit: "EUR",
    progressPercent: percent,
    status: statusFromProgress(
      percent,
      financeTransactions.length > 0,
      overLimit,
    ),
    nextAction: overLimit ? "Pause spend" : "Log transaction",
  });
}

export function calculateInvestmentProgress(
  investmentPositions: InvestmentPosition[],
  targets: DomainTargets,
): DomainProgress {
  const invested = sum(
    investmentPositions
      .filter((position) => isThisMonth(position.createdAt.slice(0, 10)))
      .map((position) => (position.averageBuyPrice ?? 0) * position.quantity),
  );
  const target = targets.investments.monthlyInvestmentTarget;
  const percent = target
    ? (invested / target) * 100
    : investmentPositions.length > 0
      ? 100
      : 0;

  return progressCard({
    domain: "investments",
    label: "Investments",
    currentValue: invested,
    targetValue: target,
    unit: "USD",
    progressPercent: percent,
    status: statusFromProgress(percent, investmentPositions.length > 0),
    nextAction:
      invested >= (target ?? Number.POSITIVE_INFINITY)
        ? "Review allocation"
        : "Add position",
  });
}

export function calculateBusinessProgress(
  businessLogs: BusinessLog[],
  focusSessions: FocusSession[],
  targets: DomainTargets,
): DomainProgress {
  const businessMinutes = sum([
    ...businessLogs
      .filter((log) => isThisWeek(log.date))
      .map((log) => log.durationMinutes),
    ...focusSessions
      .filter(
        (session) =>
          isThisWeek(session.date) &&
          (session.project ?? "").toLowerCase().includes("business"),
      )
      .map((session) => session.durationMinutes),
  ]);
  const hours = Math.round((businessMinutes / 60) * 10) / 10;
  const target = targets.business.hoursPerWeek;
  const percent = target > 0 ? (hours / target) * 100 : 0;

  return progressCard({
    domain: "business",
    label: "Business",
    currentValue: hours,
    targetValue: target,
    unit: "h",
    progressPercent: percent,
    status: statusFromProgress(percent, businessMinutes > 0),
    nextAction: hours >= target ? "Review output" : targets.business.priority,
  });
}

export function calculateDomainProgress(
  targets: DomainTargets,
  localData: LocalProgressData,
): DomainProgress[] {
  return [
    calculateNutritionProgress(localData.nutritionEntries, targets),
    calculateTrainingProgress(localData.trainingSessions, targets),
    calculateSleepProgress(localData.dailyLogs, targets),
    calculateBodyProgress(localData.bodyCheckins, targets),
    calculateFocusProgress(localData.focusSessions, targets),
    calculateMoneyProgress(localData.financeTransactions, targets),
    calculateInvestmentProgress(localData.investmentPositions, targets),
    calculateBusinessProgress(
      localData.businessLogs,
      localData.focusSessions,
      targets,
    ),
  ];
}

export function calculateOverallProgress(domainProgress: DomainProgress[]) {
  return Math.round(
    average(domainProgress.map((domain) => domain.progressPercent)) ?? 0,
  );
}

export function getStrongestDomain(domainProgress: DomainProgress[]) {
  return (
    [...domainProgress].sort(
      (a, b) => b.progressPercent - a.progressPercent,
    )[0] ?? null
  );
}

export function getWeakestDomain(domainProgress: DomainProgress[]) {
  return (
    [...domainProgress].sort(
      (a, b) => a.progressPercent - b.progressPercent,
    )[0] ?? null
  );
}

export function generateNextBestAction(domainProgress: DomainProgress[]) {
  const priority = getWeakestDomain(domainProgress);
  return priority?.nextAction ?? "Set your targets";
}

export function generateDashboardPriority(
  domainProgress: DomainProgress[],
): DashboardPriority {
  const priority = getWeakestDomain(domainProgress);
  return {
    domain: priority?.domain ?? "nutrition",
    label: priority?.label ?? "Nutrition",
    action: priority?.nextAction ?? "Add meal",
    status: priority?.status ?? "needs_log",
  };
}

export function calculateGoalProgress(
  targets: DomainTargets,
  localData: LocalProgressData,
): GoalProgress {
  const domainProgress = calculateDomainProgress(targets, localData);
  return {
    overallProgressPercent: calculateOverallProgress(domainProgress),
    strongestDomain: getStrongestDomain(domainProgress),
    weakestDomain: getWeakestDomain(domainProgress),
    topPriority: generateDashboardPriority(domainProgress),
    nextBestAction: generateNextBestAction(domainProgress),
    domainProgress,
  };
}
