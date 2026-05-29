import type {
  DomainTargets,
  LifeGoals,
  OnboardingProfile,
} from "@/features/progress/types";

function roundToNearestFive(value: number) {
  return Math.round(value / 5) * 5;
}

export function generateTargetsFromOnboarding(
  profile: OnboardingProfile,
  goals: LifeGoals,
): DomainTargets {
  const defaultProtein =
    goals.targetProteinG ??
    (profile.currentWeightKg
      ? roundToNearestFive(profile.currentWeightKg * 1.8)
      : null);

  return {
    body: {
      currentWeightKg: profile.currentWeightKg,
      targetWeightKg: goals.targetWeightKg,
      checkinFrequency: goals.bodyCheckinFrequency,
    },
    nutrition: {
      caloriesPerDay: goals.targetCalories,
      proteinGPerDay: defaultProtein,
      mealsPerDay: goals.mealsPerDay,
    },
    training: {
      sessionsPerWeek: goals.targetTrainingDaysPerWeek,
    },
    sleep: {
      hoursPerNight: goals.targetSleepHours,
      qualityTarget: 8,
    },
    focus: {
      minutesPerDay: goals.targetFocusMinutesPerDay,
    },
    money: {
      monthlyIncome: goals.monthlyIncome,
      monthlySpendingLimit: goals.monthlySpendingLimit,
      monthlySavingTarget: goals.monthlySavingTarget,
    },
    business: {
      hoursPerWeek: goals.weeklyBusinessHoursTarget,
      targetMonthlyRevenue: goals.targetMonthlyRevenue,
      priority: goals.businessPriority,
    },
    investments: {
      monthlyInvestmentTarget: goals.monthlyInvestmentTarget,
    },
  };
}
