"use client";

import { useEffect, useMemo, useState } from "react";
import { useBody } from "@/features/body/use-body";
import { useBusiness } from "@/features/business/use-business";
import { useDailyLogs } from "@/features/daily-logs/use-daily-logs";
import { useFinances } from "@/features/finances/use-finances";
import { useFocus } from "@/features/focus/use-focus";
import { useInvestments } from "@/features/investments/use-investments";
import { useNutrition } from "@/features/nutrition/use-nutrition";
import { calculateGoalProgress } from "@/features/progress/progress-engine";
import {
  isOnboardingCompleted,
  readDomainTargets,
  readLifeGoals,
  readOnboardingProfile,
  saveProgressState,
} from "@/features/progress/storage";
import type {
  DomainTargets,
  LifeGoals,
  OnboardingProfile,
  ProgressState,
} from "@/features/progress/types";
import { useTraining } from "@/features/training/use-training";

export function useProgress() {
  const dailyLogs = useDailyLogs();
  const nutrition = useNutrition();
  const training = useTraining();
  const body = useBody();
  const focus = useFocus();
  const finances = useFinances();
  const investments = useInvestments();
  const business = useBusiness();
  const [completed, setCompleted] = useState(false);
  const [profile, setProfile] = useState<OnboardingProfile | null>(null);
  const [goals, setGoals] = useState<LifeGoals | null>(null);
  const [targets, setTargets] = useState<DomainTargets | null>(null);
  const [isStorageLoaded, setIsStorageLoaded] = useState(false);

  useEffect(() => {
    const refresh = () => {
      setCompleted(isOnboardingCompleted());
      setProfile(readOnboardingProfile());
      setGoals(readLifeGoals());
      setTargets(readDomainTargets());
      setIsStorageLoaded(true);
    };

    refresh();
    window.addEventListener("storage", refresh);
    window.addEventListener("os-life:storage", refresh);
    return () => {
      window.removeEventListener("storage", refresh);
      window.removeEventListener("os-life:storage", refresh);
    };
  }, []);

  const repositoriesLoaded =
    dailyLogs.isLoaded &&
    nutrition.isLoaded &&
    training.isLoaded &&
    body.isLoaded &&
    focus.isLoaded &&
    finances.isLoaded &&
    investments.isLoaded &&
    business.isLoaded;

  const goalProgress = useMemo(() => {
    if (!targets) return null;

    return calculateGoalProgress(targets, {
      dailyLogs: dailyLogs.logs,
      nutritionEntries: nutrition.items,
      trainingSessions: training.items,
      bodyCheckins: body.items,
      focusSessions: focus.items,
      financeTransactions: finances.items,
      investmentPositions: investments.items,
      businessLogs: business.items,
    });
  }, [
    body.items,
    business.items,
    dailyLogs.logs,
    finances.items,
    focus.items,
    investments.items,
    nutrition.items,
    targets,
    training.items,
  ]);

  const progressState = useMemo<ProgressState | null>(() => {
    if (!goalProgress) return null;
    return { ...goalProgress, updatedAt: new Date().toISOString() };
  }, [goalProgress]);

  useEffect(() => {
    if (progressState && completed && repositoriesLoaded) {
      saveProgressState(progressState);
    }
  }, [completed, progressState, repositoriesLoaded]);

  return {
    completed,
    profile,
    goals,
    targets,
    progressState,
    isLoaded: isStorageLoaded && repositoriesLoaded,
    repositories: {
      dailyLogs,
      nutrition,
      training,
      body,
      focus,
      finances,
      investments,
      business,
    },
  };
}
