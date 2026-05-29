"use client";

import Link from "next/link";
import { useState } from "react";
import {
  Banknote,
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
import { clearAllLocalData, osLifeStorageKeys } from "@/lib/repositories";

export default function SettingsPage() {
  const [message, setMessage] = useState<string | null>(null);

  async function handleClear() {
    const confirmed = window.confirm(
      "Clear all local OS-Life data stored in this browser?",
    );
    if (!confirmed) return;
    await clearAllLocalData();
    setMessage("Local browser data cleared.");
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

      <DashboardCard title="LocalStorage keys">
        <div className="grid gap-2 text-sm sm:grid-cols-2">
          {Object.values(osLifeStorageKeys).map((key) => (
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
