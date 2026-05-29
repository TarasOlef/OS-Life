"use client";

import {
  Activity,
  Banknote,
  Dumbbell,
  LineChart,
  Moon,
  Target,
  Utensils,
  Weight,
} from "lucide-react";
import { DashboardCard } from "@/components/app/dashboard-card";
import { DemoChart } from "@/components/app/demo-chart";
import { EmptyState } from "@/components/app/empty-state";
import { CompactStatCard } from "@/components/app/compact-stat-card";
import { PageHeader } from "@/components/app/page-header";
import { ProgressRing } from "@/components/app/progress-ring";
import { QuickActionButton } from "@/components/app/quick-action-button";
import { Badge } from "@/components/ui/badge";
import { useDashboard } from "@/features/dashboard/use-dashboard";
import { currency, formatNumber } from "@/lib/data/format";

export default function DashboardPage() {
  const dashboard = useDashboard();
  const hasChartData = dashboard.weeklyTrend.some((point) => point.score > 45);

  return (
    <>
      <PageHeader
        title="OS-Life"
        description="Command center"
        actions={<Badge tone="info">Local</Badge>}
      />

      <section className="grid gap-4 xl:grid-cols-[1.15fr_0.85fr]">
        <div className="rounded-[2rem] bg-card p-6 shadow-[0_18px_55px_rgb(0_0_0/0.06)] dark:border dark:border-border/60 dark:shadow-none">
          <div className="flex items-center justify-between gap-5">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.14em] text-muted-foreground">
                Local score
              </p>
              <p className="mt-3 text-6xl font-semibold tracking-tight">
                {dashboard.isLoaded ? dashboard.lifeScore : "--"}
              </p>
              <p className="mt-3 max-w-sm text-sm text-muted-foreground">
                {dashboard.priority}
              </p>
            </div>
            <ProgressRing
              value={dashboard.lifeScore}
              size={124}
              stroke={12}
              label={`${dashboard.lifeScore}`}
            />
          </div>
        </div>
        <DashboardCard title="Today's priority">
          <p className="text-sm leading-6 text-muted-foreground">
            {dashboard.priority}
          </p>
        </DashboardCard>
        <DashboardCard title="Recent signals">
          <ul className="space-y-3 text-sm leading-6 text-muted-foreground">
            {dashboard.recentSignals.map((signal) => (
              <li key={signal}>{signal}</li>
            ))}
          </ul>
        </DashboardCard>
        <DashboardCard title="Quick actions">
          <div className="grid gap-2">
            <QuickActionButton
              href="/nutrition"
              label="Add meal"
              icon={Utensils}
            />
            <QuickActionButton
              href="/training"
              label="Add workout"
              icon={Dumbbell}
            />
            <QuickActionButton href="/focus" label="Add focus" icon={Target} />
          </div>
        </DashboardCard>
      </section>

      <section className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <CompactStatCard
          label="Calories"
          value={
            dashboard.today.calories > 0
              ? `${dashboard.today.calories} kcal`
              : "--"
          }
          icon={Utensils}
        />
        <CompactStatCard
          label="Protein"
          value={
            dashboard.today.protein > 0 ? `${dashboard.today.protein}g` : "--"
          }
          icon={Activity}
        />
        <CompactStatCard
          label="Training"
          value={
            dashboard.today.trainingCount > 0
              ? `${dashboard.today.trainingCount}`
              : "--"
          }
          icon={Dumbbell}
        />
        <CompactStatCard
          label="Sleep"
          value={formatNumber(dashboard.today.sleepHours, " h")}
          icon={Moon}
        />
        <CompactStatCard
          label="Body"
          value={formatNumber(dashboard.today.bodyWeightKg, " kg")}
          icon={Weight}
        />
        <CompactStatCard
          label="Focus"
          value={`${dashboard.today.focusMinutes} min`}
          icon={Target}
        />
        <CompactStatCard
          label="Money"
          value={currency(dashboard.today.moneySpent)}
          icon={Banknote}
        />
        <CompactStatCard
          label="Portfolio"
          value={currency(dashboard.today.portfolioValue, "USD")}
          icon={LineChart}
        />
      </section>

      <DashboardCard title="Week">
        {hasChartData ? (
          <DemoChart data={dashboard.weeklyTrend} />
        ) : (
          <EmptyState
            title="No trend data yet"
            description="Add meals, sleep, training, focus, or body data to build the weekly trend."
            icon={Activity}
          />
        )}
      </DashboardCard>
    </>
  );
}
