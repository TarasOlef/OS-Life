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
import { MetricCard } from "@/components/app/metric-card";
import { PageHeader } from "@/components/app/page-header";
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
        eyebrow="OS-Life"
        title="OS-Life"
        description="Your personal command center."
        actions={<Badge tone="info">Local-first MVP</Badge>}
      />

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <MetricCard
          title="Life Score"
          value={dashboard.isLoaded ? String(dashboard.lifeScore) : "Loading"}
          description="Simple local score from sleep, food, training, focus, money, and body data."
          icon={Activity}
          status="warning"
        />
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

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <MetricCard
          title="Calories"
          value={
            dashboard.today.calories > 0
              ? `${dashboard.today.calories} kcal`
              : "Not logged"
          }
          description="From today's meals."
          icon={Utensils}
        />
        <MetricCard
          title="Protein"
          value={
            dashboard.today.protein > 0
              ? `${dashboard.today.protein} g`
              : "Not logged"
          }
          description="From today's meals."
          icon={Activity}
        />
        <MetricCard
          title="Training"
          value={
            dashboard.today.trainingCount > 0
              ? `${dashboard.today.trainingCount} session`
              : "No session"
          }
          description="Workout sessions today."
          icon={Dumbbell}
        />
        <MetricCard
          title="Sleep"
          value={formatNumber(dashboard.today.sleepHours, " h")}
          description="From daily sleep log."
          icon={Moon}
        />
        <MetricCard
          title="Body weight"
          value={formatNumber(dashboard.today.bodyWeightKg, " kg")}
          description="Latest body check-in."
          icon={Weight}
        />
        <MetricCard
          title="Focus"
          value={`${dashboard.today.focusMinutes} min`}
          description="Focus minutes today."
          icon={Target}
        />
        <MetricCard
          title="Money spent"
          value={currency(dashboard.today.moneySpent)}
          description="Today's transactions."
          icon={Banknote}
        />
        <MetricCard
          title="Portfolio"
          value={currency(dashboard.today.portfolioValue, "USD")}
          description="Manual current prices for now."
          icon={LineChart}
        />
      </section>

      <DashboardCard
        title="Weekly trend"
        description="Calculated from local data stored in this browser."
      >
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
