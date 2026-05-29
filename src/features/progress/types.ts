import type {
  BodyCheckin,
  DailyLog,
  FinanceTransaction,
  FocusSession,
  InvestmentPosition,
  NutritionEntry,
  TrainingSession,
} from "@/lib/data/schemas";
import type { BusinessLog } from "@/features/business/schemas";

export const progressDomains = [
  "body",
  "nutrition",
  "training",
  "sleep",
  "focus",
  "money",
  "business",
  "investments",
] as const;

export type ProgressDomain = (typeof progressDomains)[number];

export type ProgressStatus =
  | "not_started"
  | "behind"
  | "on_track"
  | "complete"
  | "over_limit"
  | "needs_log";

export type OnboardingProfile = {
  displayName: string;
  currentWeightKg: number | null;
  heightCm: number | null;
  mainFocus:
    | "Body"
    | "Gym"
    | "Nutrition"
    | "Sleep"
    | "Focus"
    | "Money"
    | "Business"
    | "Full system";
  createdAt: string;
  updatedAt: string;
};

export type LifeGoals = {
  bodyGoal:
    | "Lose fat"
    | "Build muscle"
    | "Recompose"
    | "Maintain"
    | "Get athletic";
  targetWeightKg: number | null;
  waistCm: number | null;
  bodyCheckinFrequency: "Weekly" | "Twice/month" | "Monthly";
  nutritionGoal:
    | "Cut"
    | "Lean bulk"
    | "Maintain"
    | "Recomposition"
    | "Eat cleaner";
  targetCalories: number | null;
  targetProteinG: number | null;
  mealsPerDay: number;
  nutritionIssue:
    | "Low protein"
    | "Snacks"
    | "Eating out"
    | "No structure"
    | "Overeating"
    | "Undereating";
  currentTrainingDaysPerWeek: number;
  targetTrainingDaysPerWeek: number;
  trainingGoal: "Muscle" | "Strength" | "Fat loss" | "Athletic" | "Consistency";
  trainingExperience: "Beginner" | "Intermediate" | "Advanced";
  usualSleepHours: number | null;
  targetSleepHours: number;
  sleepQuality: number | null;
  sleepIssue:
    | "Phone"
    | "Late work"
    | "Stress"
    | "No routine"
    | "Wake tired"
    | "Inconsistent";
  currentFocusMinutesPerDay: number;
  targetFocusMinutesPerDay: number;
  focusArea:
    | "Coding"
    | "Studies"
    | "Business"
    | "Fitness"
    | "Creative"
    | "Job search";
  focusIssue:
    | "Phone"
    | "Procrastination"
    | "No plan"
    | "Low energy"
    | "Too many projects"
    | "Inconsistency";
  monthlyIncome: number | null;
  monthlySpendingLimit: number | null;
  monthlySavingTarget: number | null;
  moneyControl: number | null;
  financialGoal:
    | "Spend less"
    | "Save more"
    | "Invest monthly"
    | "Build emergency fund"
    | "Increase income"
    | "Track everything";
  businessStage:
    | "No business yet"
    | "Idea"
    | "Building MVP"
    | "Launched"
    | "Getting users"
    | "Making revenue";
  businessType:
    | "App/SaaS"
    | "Content"
    | "Freelance"
    | "Ecommerce"
    | "Agency"
    | "Other";
  weeklyBusinessHoursTarget: number;
  targetMonthlyRevenue: number | null;
  mainBusinessGoal: string | null;
  businessPriority:
    | "Build product"
    | "Get users"
    | "Create content"
    | "Sell"
    | "Learn skills"
    | "Improve offer";
  investingStatus:
    | "Not started"
    | "Learning"
    | "Small positions"
    | "Monthly investor"
    | "Active portfolio";
  monthlyInvestmentTarget: number | null;
  investmentGoal:
    | "Start investing"
    | "Invest monthly"
    | "Grow portfolio"
    | "Track positions"
    | "Learn markets";
  riskStyle: "Conservative" | "Balanced" | "Growth" | "Aggressive";
  ninetyDayPriority: string | null;
  twelveMonthGoal: string | null;
  trackingStyle: "Minimal" | "Standard" | "Detailed";
  intensity: "Easy" | "Balanced" | "Aggressive";
};

export type DomainTargets = {
  body: {
    currentWeightKg: number | null;
    targetWeightKg: number | null;
    checkinFrequency: LifeGoals["bodyCheckinFrequency"];
  };
  nutrition: {
    caloriesPerDay: number | null;
    proteinGPerDay: number | null;
    mealsPerDay: number;
  };
  training: {
    sessionsPerWeek: number;
  };
  sleep: {
    hoursPerNight: number;
    qualityTarget: number;
  };
  focus: {
    minutesPerDay: number;
  };
  money: {
    monthlyIncome: number | null;
    monthlySpendingLimit: number | null;
    monthlySavingTarget: number | null;
  };
  business: {
    hoursPerWeek: number;
    targetMonthlyRevenue: number | null;
    priority: LifeGoals["businessPriority"];
  };
  investments: {
    monthlyInvestmentTarget: number | null;
  };
};

export type DomainProgress = {
  domain: ProgressDomain;
  label: string;
  currentValue: number;
  targetValue: number | null;
  unit: string;
  progressPercent: number;
  status: ProgressStatus;
  nextAction: string;
  updatedAt: string;
};

export type GoalProgress = {
  overallProgressPercent: number;
  strongestDomain: DomainProgress | null;
  weakestDomain: DomainProgress | null;
  topPriority: DashboardPriority;
  nextBestAction: string;
  domainProgress: DomainProgress[];
};

export type DashboardPriority = {
  domain: ProgressDomain;
  label: string;
  action: string;
  status: ProgressStatus;
};

export type ProgressState = GoalProgress & {
  updatedAt: string;
};

export type LocalProgressData = {
  dailyLogs: DailyLog[];
  nutritionEntries: NutritionEntry[];
  trainingSessions: TrainingSession[];
  bodyCheckins: BodyCheckin[];
  focusSessions: FocusSession[];
  financeTransactions: FinanceTransaction[];
  investmentPositions: InvestmentPosition[];
  businessLogs: BusinessLog[];
};
