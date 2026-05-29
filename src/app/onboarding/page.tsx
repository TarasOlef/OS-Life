"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { ArrowRight, Check, ChevronLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ProgressRing } from "@/components/app/progress-ring";
import { Field, TextArea, TextInput } from "@/components/forms/form-controls";
import { generateTargetsFromOnboarding } from "@/features/progress/target-engine";
import { calculateGoalProgress } from "@/features/progress/progress-engine";
import { saveOnboardingState } from "@/features/progress/storage";
import type { LifeGoals, OnboardingProfile } from "@/features/progress/types";
import { cn } from "@/lib/utils";

const steps = [
  "Profile",
  "Body",
  "Nutrition",
  "Training",
  "Sleep",
  "Focus",
  "Money",
  "Business",
  "Invest",
  "Direction",
] as const;

const now = new Date().toISOString();

const defaultProfile: OnboardingProfile = {
  displayName: "Taras",
  currentWeightKg: null,
  heightCm: null,
  mainFocus: "Full system",
  createdAt: now,
  updatedAt: now,
};

const defaultGoals: LifeGoals = {
  bodyGoal: "Recompose",
  targetWeightKg: null,
  waistCm: null,
  bodyCheckinFrequency: "Weekly",
  nutritionGoal: "Recomposition",
  targetCalories: null,
  targetProteinG: null,
  mealsPerDay: 3,
  nutritionIssue: "Low protein",
  currentTrainingDaysPerWeek: 2,
  targetTrainingDaysPerWeek: 4,
  trainingGoal: "Muscle",
  trainingExperience: "Intermediate",
  usualSleepHours: null,
  targetSleepHours: 7.5,
  sleepQuality: null,
  sleepIssue: "Inconsistent",
  currentFocusMinutesPerDay: 30,
  targetFocusMinutesPerDay: 90,
  focusArea: "Coding",
  focusIssue: "Phone",
  monthlyIncome: null,
  monthlySpendingLimit: null,
  monthlySavingTarget: null,
  moneyControl: null,
  financialGoal: "Save more",
  businessStage: "Building MVP",
  businessType: "App/SaaS",
  weeklyBusinessHoursTarget: 8,
  targetMonthlyRevenue: null,
  mainBusinessGoal: null,
  businessPriority: "Build product",
  investingStatus: "Learning",
  monthlyInvestmentTarget: null,
  investmentGoal: "Invest monthly",
  riskStyle: "Balanced",
  ninetyDayPriority: null,
  twelveMonthGoal: null,
  trackingStyle: "Standard",
  intensity: "Balanced",
};

export default function OnboardingPage() {
  const [step, setStep] = useState(0);
  const [profile, setProfile] = useState<OnboardingProfile>(defaultProfile);
  const [goals, setGoals] = useState<LifeGoals>(defaultGoals);
  const [showResult, setShowResult] = useState(false);
  const targets = useMemo(
    () => generateTargetsFromOnboarding(profile, goals),
    [goals, profile],
  );
  const initialProgress = useMemo(
    () =>
      calculateGoalProgress(targets, {
        dailyLogs: [],
        nutritionEntries: [],
        trainingSessions: [],
        bodyCheckins: [],
        focusSessions: [],
        financeTransactions: [],
        investmentPositions: [],
        businessLogs: [],
      }),
    [targets],
  );

  function updateGoal<K extends keyof LifeGoals>(key: K, value: LifeGoals[K]) {
    setGoals((current) => ({ ...current, [key]: value }));
  }

  function finish() {
    const timestamp = new Date().toISOString();
    const finalProfile = {
      ...profile,
      updatedAt: timestamp,
      createdAt: profile.createdAt || timestamp,
    };
    const progress = { ...initialProgress, updatedAt: timestamp };
    saveOnboardingState({
      profile: finalProfile,
      goals,
      targets,
      progress,
    });
    setShowResult(true);
  }

  if (showResult) {
    return (
      <main className="min-h-screen bg-background px-4 py-6 text-foreground">
        <div className="mx-auto flex min-h-[calc(100vh-3rem)] max-w-4xl flex-col justify-center">
          <div className="rounded-[2rem] bg-card p-6 shadow-[0_18px_55px_rgb(0_0_0/0.08)] dark:border dark:border-border/60 dark:shadow-none sm:p-8">
            <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground">
                  OS-Life
                </p>
                <h1 className="mt-3 text-4xl font-semibold tracking-tight">
                  Your OS is ready
                </h1>
                <p className="mt-3 text-sm text-muted-foreground">
                  Main priority: {initialProgress.nextBestAction}
                </p>
              </div>
              <ProgressRing
                value={initialProgress.overallProgressPercent}
                size={132}
                stroke={12}
                label={`${initialProgress.overallProgressPercent}%`}
              />
            </div>
            <div className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
              {initialProgress.domainProgress.map((domain) => (
                <div
                  key={domain.domain}
                  className="rounded-[1.35rem] bg-secondary/40 p-4"
                >
                  <p className="text-sm font-semibold">{domain.label}</p>
                  <p className="mt-2 text-2xl font-semibold">
                    {domain.targetValue ?? "--"}
                    <span className="text-sm text-muted-foreground">
                      {" "}
                      {domain.unit}
                    </span>
                  </p>
                  <p className="mt-2 text-xs text-muted-foreground">
                    {domain.nextAction}
                  </p>
                </div>
              ))}
            </div>
            <Button asChild className="mt-8 w-full sm:w-auto">
              <Link href="/dashboard">
                Enter dashboard
                <ArrowRight className="size-4" aria-hidden="true" />
              </Link>
            </Button>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-background px-4 py-6 text-foreground">
      <div className="mx-auto flex min-h-[calc(100vh-3rem)] max-w-3xl flex-col">
        <header className="flex items-center justify-between">
          <Link href="/" className="text-sm font-semibold">
            OS-Life
          </Link>
          <div className="rounded-full bg-secondary px-3 py-1 text-xs font-semibold text-muted-foreground">
            {step + 1}/{steps.length}
          </div>
        </header>

        <section className="flex flex-1 flex-col justify-center py-8">
          <div className="mb-6 flex gap-1">
            {steps.map((item, index) => (
              <div
                key={item}
                className={cn(
                  "h-1 flex-1 rounded-full bg-secondary",
                  index <= step && "bg-foreground",
                )}
              />
            ))}
          </div>

          <div className="rounded-[2rem] bg-card p-5 shadow-[0_18px_55px_rgb(0_0_0/0.08)] dark:border dark:border-border/60 dark:shadow-none sm:p-7">
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground">
              {steps[step]}
            </p>
            <h1 className="mt-3 text-3xl font-semibold tracking-tight">
              {titles[step]}
            </h1>
            <div className="mt-6 grid gap-4">{renderStep()}</div>
          </div>

          <div className="mt-5 grid grid-cols-2 gap-3">
            <Button
              type="button"
              variant="secondary"
              disabled={step === 0}
              onClick={() => setStep((current) => Math.max(0, current - 1))}
            >
              <ChevronLeft className="size-4" aria-hidden="true" />
              Back
            </Button>
            <Button
              type="button"
              onClick={() =>
                step === steps.length - 1
                  ? finish()
                  : setStep((current) => current + 1)
              }
            >
              {step === steps.length - 1 ? (
                <>
                  <Check className="size-4" aria-hidden="true" />
                  Finish
                </>
              ) : (
                <>
                  Next
                  <ArrowRight className="size-4" aria-hidden="true" />
                </>
              )}
            </Button>
          </div>
        </section>
      </div>
    </main>
  );

  function renderStep() {
    switch (step) {
      case 0:
        return (
          <>
            <Field label="Name">
              <TextInput
                value={profile.displayName}
                onChange={(event) =>
                  setProfile((current) => ({
                    ...current,
                    displayName: event.target.value,
                  }))
                }
              />
            </Field>
            <NumberField
              label="Weight kg"
              value={profile.currentWeightKg}
              onChange={(value) =>
                setProfile((current) => ({
                  ...current,
                  currentWeightKg: value,
                }))
              }
            />
            <NumberField
              label="Height cm"
              value={profile.heightCm}
              onChange={(value) =>
                setProfile((current) => ({ ...current, heightCm: value }))
              }
            />
            <ChipGroup
              label="Main focus"
              value={profile.mainFocus}
              options={[
                "Body",
                "Gym",
                "Nutrition",
                "Sleep",
                "Focus",
                "Money",
                "Business",
                "Full system",
              ]}
              onChange={(value) =>
                setProfile((current) => ({ ...current, mainFocus: value }))
              }
            />
          </>
        );
      case 1:
        return (
          <>
            <ChipGroup
              label="Body goal"
              value={goals.bodyGoal}
              options={[
                "Lose fat",
                "Build muscle",
                "Recompose",
                "Maintain",
                "Get athletic",
              ]}
              onChange={(value) => updateGoal("bodyGoal", value)}
            />
            <NumberField
              label="Target kg"
              value={goals.targetWeightKg}
              onChange={(value) => updateGoal("targetWeightKg", value)}
            />
            <NumberField
              label="Waist cm"
              value={goals.waistCm}
              onChange={(value) => updateGoal("waistCm", value)}
            />
            <ChipGroup
              label="Check-in"
              value={goals.bodyCheckinFrequency}
              options={["Weekly", "Twice/month", "Monthly"]}
              onChange={(value) => updateGoal("bodyCheckinFrequency", value)}
            />
          </>
        );
      case 2:
        return (
          <>
            <ChipGroup
              label="Nutrition"
              value={goals.nutritionGoal}
              options={[
                "Cut",
                "Lean bulk",
                "Maintain",
                "Recomposition",
                "Eat cleaner",
              ]}
              onChange={(value) => updateGoal("nutritionGoal", value)}
            />
            <NumberField
              label="Calories"
              value={goals.targetCalories}
              onChange={(value) => updateGoal("targetCalories", value)}
            />
            <NumberField
              label="Protein g"
              value={goals.targetProteinG}
              placeholder={
                profile.currentWeightKg
                  ? `${Math.round((profile.currentWeightKg * 1.8) / 5) * 5} default`
                  : "Optional"
              }
              onChange={(value) => updateGoal("targetProteinG", value)}
            />
            <NumberField
              label="Meals/day"
              value={goals.mealsPerDay}
              onChange={(value) => updateGoal("mealsPerDay", value ?? 3)}
            />
            <ChipGroup
              label="Issue"
              value={goals.nutritionIssue}
              options={[
                "Low protein",
                "Snacks",
                "Eating out",
                "No structure",
                "Overeating",
                "Undereating",
              ]}
              onChange={(value) => updateGoal("nutritionIssue", value)}
            />
          </>
        );
      case 3:
        return (
          <>
            <NumberField
              label="Now/week"
              value={goals.currentTrainingDaysPerWeek}
              onChange={(value) =>
                updateGoal("currentTrainingDaysPerWeek", value ?? 0)
              }
            />
            <NumberField
              label="Target/week"
              value={goals.targetTrainingDaysPerWeek}
              onChange={(value) =>
                updateGoal("targetTrainingDaysPerWeek", value ?? 1)
              }
            />
            <ChipGroup
              label="Goal"
              value={goals.trainingGoal}
              options={[
                "Muscle",
                "Strength",
                "Fat loss",
                "Athletic",
                "Consistency",
              ]}
              onChange={(value) => updateGoal("trainingGoal", value)}
            />
            <ChipGroup
              label="Experience"
              value={goals.trainingExperience}
              options={["Beginner", "Intermediate", "Advanced"]}
              onChange={(value) => updateGoal("trainingExperience", value)}
            />
          </>
        );
      case 4:
        return (
          <>
            <NumberField
              label="Usual sleep"
              value={goals.usualSleepHours}
              onChange={(value) => updateGoal("usualSleepHours", value)}
            />
            <NumberField
              label="Target sleep"
              value={goals.targetSleepHours}
              onChange={(value) => updateGoal("targetSleepHours", value ?? 7.5)}
            />
            <NumberField
              label="Quality"
              value={goals.sleepQuality}
              onChange={(value) => updateGoal("sleepQuality", value)}
            />
            <ChipGroup
              label="Issue"
              value={goals.sleepIssue}
              options={[
                "Phone",
                "Late work",
                "Stress",
                "No routine",
                "Wake tired",
                "Inconsistent",
              ]}
              onChange={(value) => updateGoal("sleepIssue", value)}
            />
          </>
        );
      case 5:
        return (
          <>
            <NumberField
              label="Now min/day"
              value={goals.currentFocusMinutesPerDay}
              onChange={(value) =>
                updateGoal("currentFocusMinutesPerDay", value ?? 0)
              }
            />
            <NumberField
              label="Target min/day"
              value={goals.targetFocusMinutesPerDay}
              onChange={(value) =>
                updateGoal("targetFocusMinutesPerDay", value ?? 30)
              }
            />
            <ChipGroup
              label="Area"
              value={goals.focusArea}
              options={[
                "Coding",
                "Studies",
                "Business",
                "Fitness",
                "Creative",
                "Job search",
              ]}
              onChange={(value) => updateGoal("focusArea", value)}
            />
            <ChipGroup
              label="Issue"
              value={goals.focusIssue}
              options={[
                "Phone",
                "Procrastination",
                "No plan",
                "Low energy",
                "Too many projects",
                "Inconsistency",
              ]}
              onChange={(value) => updateGoal("focusIssue", value)}
            />
          </>
        );
      case 6:
        return (
          <>
            <NumberField
              label="Income"
              value={goals.monthlyIncome}
              onChange={(value) => updateGoal("monthlyIncome", value)}
            />
            <NumberField
              label="Spend limit"
              value={goals.monthlySpendingLimit}
              onChange={(value) => updateGoal("monthlySpendingLimit", value)}
            />
            <NumberField
              label="Save/month"
              value={goals.monthlySavingTarget}
              onChange={(value) => updateGoal("monthlySavingTarget", value)}
            />
            <NumberField
              label="Control 1-10"
              value={goals.moneyControl}
              onChange={(value) => updateGoal("moneyControl", value)}
            />
            <ChipGroup
              label="Goal"
              value={goals.financialGoal}
              options={[
                "Spend less",
                "Save more",
                "Invest monthly",
                "Build emergency fund",
                "Increase income",
                "Track everything",
              ]}
              onChange={(value) => updateGoal("financialGoal", value)}
            />
          </>
        );
      case 7:
        return (
          <>
            <ChipGroup
              label="Stage"
              value={goals.businessStage}
              options={[
                "No business yet",
                "Idea",
                "Building MVP",
                "Launched",
                "Getting users",
                "Making revenue",
              ]}
              onChange={(value) => updateGoal("businessStage", value)}
            />
            <ChipGroup
              label="Type"
              value={goals.businessType}
              options={[
                "App/SaaS",
                "Content",
                "Freelance",
                "Ecommerce",
                "Agency",
                "Other",
              ]}
              onChange={(value) => updateGoal("businessType", value)}
            />
            <NumberField
              label="Hours/week"
              value={goals.weeklyBusinessHoursTarget}
              onChange={(value) =>
                updateGoal("weeklyBusinessHoursTarget", value ?? 0)
              }
            />
            <NumberField
              label="Revenue target"
              value={goals.targetMonthlyRevenue}
              onChange={(value) => updateGoal("targetMonthlyRevenue", value)}
            />
            <ChipGroup
              label="Priority"
              value={goals.businessPriority}
              options={[
                "Build product",
                "Get users",
                "Create content",
                "Sell",
                "Learn skills",
                "Improve offer",
              ]}
              onChange={(value) => updateGoal("businessPriority", value)}
            />
          </>
        );
      case 8:
        return (
          <>
            <ChipGroup
              label="Status"
              value={goals.investingStatus}
              options={[
                "Not started",
                "Learning",
                "Small positions",
                "Monthly investor",
                "Active portfolio",
              ]}
              onChange={(value) => updateGoal("investingStatus", value)}
            />
            <NumberField
              label="Invest/month"
              value={goals.monthlyInvestmentTarget}
              onChange={(value) => updateGoal("monthlyInvestmentTarget", value)}
            />
            <ChipGroup
              label="Goal"
              value={goals.investmentGoal}
              options={[
                "Start investing",
                "Invest monthly",
                "Grow portfolio",
                "Track positions",
                "Learn markets",
              ]}
              onChange={(value) => updateGoal("investmentGoal", value)}
            />
            <ChipGroup
              label="Risk"
              value={goals.riskStyle}
              options={["Conservative", "Balanced", "Growth", "Aggressive"]}
              onChange={(value) => updateGoal("riskStyle", value)}
            />
          </>
        );
      default:
        return (
          <>
            <Field label="90 days">
              <TextArea
                value={goals.ninetyDayPriority ?? ""}
                onChange={(event) =>
                  updateGoal(
                    "ninetyDayPriority",
                    nullableText(event.target.value),
                  )
                }
              />
            </Field>
            <Field label="12 months">
              <TextArea
                value={goals.twelveMonthGoal ?? ""}
                onChange={(event) =>
                  updateGoal(
                    "twelveMonthGoal",
                    nullableText(event.target.value),
                  )
                }
              />
            </Field>
            <ChipGroup
              label="Tracking"
              value={goals.trackingStyle}
              options={["Minimal", "Standard", "Detailed"]}
              onChange={(value) => updateGoal("trackingStyle", value)}
            />
            <ChipGroup
              label="Intensity"
              value={goals.intensity}
              options={["Easy", "Balanced", "Aggressive"]}
              onChange={(value) => updateGoal("intensity", value)}
            />
          </>
        );
    }
  }
}

const titles = [
  "Set your baseline",
  "Define body direction",
  "Set nutrition targets",
  "Set training rhythm",
  "Protect recovery",
  "Set focus output",
  "Set money guardrails",
  "Set business execution",
  "Set investing direction",
  "Choose the next 90 days",
] as const;

function NumberField({
  label,
  value,
  placeholder,
  onChange,
}: {
  label: string;
  value: number | null;
  placeholder?: string;
  onChange: (value: number | null) => void;
}) {
  return (
    <Field label={label}>
      <TextInput
        type="number"
        inputMode="decimal"
        value={value ?? ""}
        placeholder={placeholder}
        onChange={(event) =>
          onChange(
            event.target.value === "" ? null : Number(event.target.value),
          )
        }
      />
    </Field>
  );
}

function ChipGroup<T extends string>({
  label,
  value,
  options,
  onChange,
}: {
  label: string;
  value: T;
  options: readonly T[];
  onChange: (value: T) => void;
}) {
  return (
    <div className="grid gap-2">
      <p className="text-sm font-medium">{label}</p>
      <div className="flex flex-wrap gap-2">
        {options.map((option) => (
          <button
            key={option}
            type="button"
            onClick={() => onChange(option)}
            className={cn(
              "rounded-full border border-border bg-secondary/50 px-3 py-2 text-sm font-semibold text-muted-foreground transition active:scale-[0.98]",
              value === option &&
                "border-foreground bg-foreground text-background",
            )}
          >
            {option}
          </button>
        ))}
      </div>
    </div>
  );
}

function nullableText(value: string) {
  const trimmed = value.trim();
  return trimmed ? trimmed : null;
}
