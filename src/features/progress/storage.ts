"use client";

import type { z } from "zod";
import {
  domainTargetsSchema,
  lifeGoalsSchema,
  onboardingProfileSchema,
  progressStateSchema,
} from "@/features/progress/schemas";
import type {
  DomainTargets,
  LifeGoals,
  OnboardingProfile,
  ProgressState,
} from "@/features/progress/types";

export const progressStorageKeys = {
  onboardingCompleted: "os-life:onboarding-completed",
  onboardingProfile: "os-life:onboarding-profile",
  lifeGoals: "os-life:life-goals",
  domainTargets: "os-life:domain-targets",
  progressState: "os-life:progress-state",
};

function canUseLocalStorage() {
  return typeof window !== "undefined" && Boolean(window.localStorage);
}

function readJson<T>(key: string, schema: z.ZodType<T>): T | null {
  if (!canUseLocalStorage()) return null;
  const raw = window.localStorage.getItem(key);
  if (!raw) return null;

  try {
    const parsed = schema.safeParse(JSON.parse(raw));
    return parsed.success ? parsed.data : null;
  } catch {
    return null;
  }
}

function writeJson<T>(key: string, value: T) {
  if (!canUseLocalStorage()) return;
  window.localStorage.setItem(key, JSON.stringify(value));
  window.dispatchEvent(new Event("os-life:storage"));
}

export function isOnboardingCompleted() {
  if (!canUseLocalStorage()) return false;
  return (
    window.localStorage.getItem(progressStorageKeys.onboardingCompleted) ===
    "true"
  );
}

export function readOnboardingProfile(): OnboardingProfile | null {
  return readJson(
    progressStorageKeys.onboardingProfile,
    onboardingProfileSchema,
  );
}

export function readLifeGoals(): LifeGoals | null {
  return readJson(progressStorageKeys.lifeGoals, lifeGoalsSchema);
}

export function readDomainTargets(): DomainTargets | null {
  return readJson(progressStorageKeys.domainTargets, domainTargetsSchema);
}

export function readProgressState(): ProgressState | null {
  return readJson(progressStorageKeys.progressState, progressStateSchema);
}

export function saveOnboardingState(input: {
  profile: OnboardingProfile;
  goals: LifeGoals;
  targets: DomainTargets;
  progress: ProgressState;
}) {
  if (!canUseLocalStorage()) return;
  writeJson(progressStorageKeys.onboardingProfile, input.profile);
  writeJson(progressStorageKeys.lifeGoals, input.goals);
  writeJson(progressStorageKeys.domainTargets, input.targets);
  writeJson(progressStorageKeys.progressState, input.progress);
  window.localStorage.setItem(progressStorageKeys.onboardingCompleted, "true");
  window.dispatchEvent(new Event("os-life:storage"));
}

export function saveProgressState(progress: ProgressState) {
  writeJson(progressStorageKeys.progressState, progress);
}

export function resetOnboardingState() {
  if (!canUseLocalStorage()) return;
  Object.values(progressStorageKeys).forEach((key) => {
    window.localStorage.removeItem(key);
  });
  window.dispatchEvent(new Event("os-life:storage"));
}
