"use client";

import Link from "next/link";
import { useState } from "react";
import {
  Banknote,
  BriefcaseBusiness,
  Database,
  LockKeyhole,
  MonitorCog,
  Moon,
  Target,
  Trash2,
  TrendingUp,
  UserRound,
} from "lucide-react";
import { DashboardCard } from "@/components/app/dashboard-card";
import { MetricCard } from "@/components/app/metric-card";
import { PageHeader } from "@/components/app/page-header";
import { QuickActionButton } from "@/components/app/quick-action-button";
import { Button } from "@/components/ui/button";
import {
  businessStorageKey,
  localBusinessRepository,
} from "@/features/business/repository";
import {
  progressStorageKeys,
  resetOnboardingState,
} from "@/features/progress/storage";
import { useProgress } from "@/features/progress/use-progress";
import { clearAllLocalData, osLifeStorageKeys } from "@/lib/repositories";

export default function SettingsPage() {
  const [message, setMessage] = useState<string | null>(null);
  const progress = useProgress();

  async function handleClear() {
    const confirmed = window.confirm(
      "Clear all local OS-Life data stored in this browser?",
    );
    if (!confirmed) return;
    await clearAllLocalData();
    await localBusinessRepository.clear();
    resetOnboardingState();
    setMessage("Local browser data cleared.");
  }

  function handleResetOnboarding() {
    const confirmed = window.confirm("Reset onboarding and targets?");
    if (!confirmed) return;
    resetOnboardingState();
    setMessage("Onboarding reset. Tracking logs kept.");
  }

  return (
    <>
      <PageHeader
        eyebrow="Settings"
        title="Settings"
        description="Local data"
      />

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <MetricCard
          title="Profile"
          value="Local only"
          description="No fake login is implemented."
          icon={UserRound}
        />
        <MetricCard
          title="Preferences"
          value="Prepared"
          description="Dark mode is the default."
          icon={MonitorCog}
        />
        <MetricCard
          title="Storage"
          value="localStorage"
          description="Temporary sprint persistence."
          icon={Database}
        />
        <MetricCard
          title="Security"
          value="Public-safe"
          description="No secrets are committed."
          icon={LockKeyhole}
          status="good"
        />
      </section>

      <DashboardCard title="Clear local data">
        <p className="text-sm leading-6 text-muted-foreground">
          Current sprint stores data locally in your browser under the
          `os-life:*` localStorage namespace.
        </p>
        <Button
          type="button"
          variant="outline"
          className="mt-4"
          onClick={handleClear}
        >
          <Trash2 className="size-4" aria-hidden="true" />
          Clear local data
        </Button>
        {message ? (
          <p className="mt-3 text-sm text-emerald-300">{message}</p>
        ) : null}
      </DashboardCard>

      <DashboardCard title="Goals">
        <div className="grid gap-3 sm:grid-cols-3">
          <div className="rounded-[1.25rem] bg-secondary/40 p-4">
            <p className="text-xs text-muted-foreground">Profile</p>
            <p className="mt-1 text-xl font-semibold">
              {progress.profile?.displayName ?? "Not set"}
            </p>
          </div>
          <div className="rounded-[1.25rem] bg-secondary/40 p-4">
            <p className="text-xs text-muted-foreground">Progress</p>
            <p className="mt-1 text-xl font-semibold">
              {progress.progressState
                ? `${progress.progressState.overallProgressPercent}%`
                : "--"}
            </p>
          </div>
          <div className="rounded-[1.25rem] bg-secondary/40 p-4">
            <p className="text-xs text-muted-foreground">Next</p>
            <p className="mt-1 text-xl font-semibold">
              {progress.progressState?.nextBestAction ?? "Onboarding"}
            </p>
          </div>
        </div>
        <Button
          type="button"
          variant="secondary"
          className="mt-4"
          onClick={handleResetOnboarding}
        >
          Reset onboarding
        </Button>
      </DashboardCard>

      <DashboardCard title="LocalStorage keys">
        <div className="grid gap-2 text-sm sm:grid-cols-2">
          {[
            ...Object.values(osLifeStorageKeys),
            ...Object.values(progressStorageKeys),
            businessStorageKey,
          ].map((key) => (
            <code
              key={key}
              className="rounded-md border border-border bg-secondary/30 px-3 py-2 text-muted-foreground"
            >
              {key}
            </code>
          ))}
        </div>
      </DashboardCard>

      <DashboardCard title="Security and environment note">
        <p className="text-sm leading-6 text-muted-foreground">
          This public repo never stores secrets. Future API keys must be
          server-side only. OpenAI, market data, database credentials, and any
          privileged keys must never be exposed through client code.
        </p>
      </DashboardCard>

      <DashboardCard title="More">
        <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-5">
          <QuickActionButton href="/sleep" label="Sleep" icon={Moon} />
          <QuickActionButton href="/focus" label="Focus" icon={Target} />
          <QuickActionButton
            href="/finances"
            label="Finances"
            icon={Banknote}
          />
          <QuickActionButton
            href="/investments"
            label="Investments"
            icon={TrendingUp}
          />
          <QuickActionButton
            href="/business"
            label="Business"
            icon={BriefcaseBusiness}
          />
          <QuickActionButton
            href="/settings"
            label="Settings"
            icon={MonitorCog}
          />
        </div>
      </DashboardCard>

      <DashboardCard title="Developer setup">
        <p className="text-sm leading-6 text-muted-foreground">
          Start with `npm run dev`. Future `.env.local` values should be copied
          from `.env.example`, but this sprint does not require environment
          variables to run.
        </p>
        <Link
          href="/dashboard"
          className="mt-4 inline-flex text-sm font-medium text-foreground hover:text-muted-foreground"
        >
          Return to dashboard
        </Link>
      </DashboardCard>
    </>
  );
}
