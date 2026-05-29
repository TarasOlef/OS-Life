"use client";

import Link from "next/link";
import {
  Banknote,
  BriefcaseBusiness,
  Dumbbell,
  Landmark,
  Moon,
  Target,
  Utensils,
  Weight,
} from "lucide-react";
import { AnimatedCard } from "@/components/app/animated";
import { DashboardCard } from "@/components/app/dashboard-card";
import { EmptyState } from "@/components/app/empty-state";
import { PageHeader } from "@/components/app/page-header";
import { ProgressRing } from "@/components/app/progress-ring";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { GlobalLogSheet } from "@/features/dashboard/components/global-log-sheet";
import { useProgress } from "@/features/progress/use-progress";
import type { DomainProgress, ProgressDomain } from "@/features/progress/types";
import { currency } from "@/lib/data/format";

const domainMeta: Record<
  ProgressDomain,
  { href: string; icon: typeof Utensils; accent: string }
> = {
  nutrition: { href: "/nutrition", icon: Utensils, accent: "bg-emerald-500" },
  training: { href: "/training", icon: Dumbbell, accent: "bg-blue-500" },
  sleep: { href: "/sleep", icon: Moon, accent: "bg-indigo-500" },
  body: { href: "/body", icon: Weight, accent: "bg-orange-500" },
  focus: { href: "/focus", icon: Target, accent: "bg-violet-500" },
  money: { href: "/finances", icon: Banknote, accent: "bg-sky-500" },
  investments: { href: "/investments", icon: Landmark, accent: "bg-lime-500" },
  business: {
    href: "/business",
    icon: BriefcaseBusiness,
    accent: "bg-zinc-500",
  },
};

export default function DashboardPage() {
  const progress = useProgress();
  const state = progress.progressState;
  const displayName = progress.profile?.displayName ?? "OS-Life";
  const dateLabel = new Intl.DateTimeFormat("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
  }).format(new Date());

  if (progress.isLoaded && !progress.completed) {
    return (
      <>
        <PageHeader title="OS-Life" description="Command center" />
        <DashboardCard title="Set your OS">
          <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-4xl font-semibold tracking-tight">
                Build around goals
              </p>
              <p className="mt-3 max-w-md text-sm text-muted-foreground">
                Define targets once. Logs will update progress from local data.
              </p>
            </div>
            <Button asChild>
              <Link href="/onboarding">Start onboarding</Link>
            </Button>
          </div>
        </DashboardCard>
      </>
    );
  }

  return (
    <>
      <PageHeader
        eyebrow={dateLabel}
        title={displayName}
        description="Goal progress"
        actions={<GlobalLogSheet repositories={progress.repositories} />}
      />

      <section className="grid gap-4 xl:grid-cols-[1.05fr_0.95fr]">
        <AnimatedCard>
          <div className="rounded-[2rem] bg-card p-6 shadow-[0_18px_55px_rgb(0_0_0/0.06)] dark:border dark:border-border/60 dark:shadow-none">
            <div className="flex items-center justify-between gap-5">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.14em] text-muted-foreground">
                  Life Progress
                </p>
                <p className="mt-3 text-6xl font-semibold tracking-tight">
                  {state ? `${state.overallProgressPercent}%` : "--"}
                </p>
                <p className="mt-3 text-sm font-medium text-muted-foreground">
                  Next: {state?.nextBestAction ?? "Set targets"}
                </p>
              </div>
              <ProgressRing
                value={state?.overallProgressPercent ?? 0}
                size={128}
                stroke={12}
                label={state ? `${state.overallProgressPercent}%` : "--"}
              />
            </div>
          </div>
        </AnimatedCard>

        <DashboardCard title="Next">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-3xl font-semibold tracking-tight">
                {state?.topPriority.action ?? "Start onboarding"}
              </p>
              <p className="mt-2 text-sm text-muted-foreground">
                {state?.topPriority.label ?? "Targets"}
              </p>
            </div>
            <Badge
              tone={
                state?.topPriority.status === "on_track" ? "success" : "info"
              }
            >
              {statusLabel(state?.topPriority.status)}
            </Badge>
          </div>
        </DashboardCard>
      </section>

      {state ? (
        <section className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
          {state.domainProgress.map((domain, index) => (
            <AnimatedCard key={domain.domain} delay={index * 35}>
              <DomainCard domain={domain} />
            </AnimatedCard>
          ))}
        </section>
      ) : (
        <EmptyState
          title="No targets"
          description="Finish onboarding."
          icon={Target}
        />
      )}

      <section className="grid gap-4 lg:grid-cols-2">
        <DashboardCard title="Strongest">
          <Signal domain={state?.strongestDomain ?? null} />
        </DashboardCard>
        <DashboardCard title="Needs attention">
          <Signal domain={state?.weakestDomain ?? null} />
        </DashboardCard>
      </section>
    </>
  );
}

function DomainCard({ domain }: { domain: DomainProgress }) {
  const meta = domainMeta[domain.domain];
  const Icon = meta.icon;

  return (
    <Link
      href={meta.href}
      className="block rounded-[1.6rem] bg-card p-4 shadow-[0_12px_36px_rgb(0_0_0/0.05)] transition active:scale-[0.98] dark:border dark:border-border/60 dark:shadow-none"
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-2">
          <span className="flex size-9 items-center justify-center rounded-full bg-secondary">
            <Icon className="size-4" aria-hidden="true" />
          </span>
          <div>
            <p className="font-semibold">{domain.label}</p>
            <p className="text-xs text-muted-foreground">
              {statusLabel(domain.status)}
            </p>
          </div>
        </div>
        <ProgressRing value={domain.progressPercent} size={46} stroke={5} />
      </div>
      <p className="mt-5 text-3xl font-semibold tracking-tight">
        {formatDomainValue(domain)}
      </p>
      <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-secondary">
        <div
          className={meta.accent}
          style={{ width: `${domain.progressPercent}%`, height: "100%" }}
        />
      </div>
      <p className="mt-3 text-xs font-medium text-muted-foreground">
        {domain.nextAction}
      </p>
    </Link>
  );
}

function Signal({ domain }: { domain: DomainProgress | null }) {
  if (!domain) {
    return <p className="text-sm text-muted-foreground">No data yet.</p>;
  }

  return (
    <div>
      <p className="text-3xl font-semibold tracking-tight">{domain.label}</p>
      <p className="mt-2 text-sm text-muted-foreground">{domain.nextAction}</p>
    </div>
  );
}

function formatDomainValue(domain: DomainProgress) {
  const current =
    domain.unit === "EUR" || domain.unit === "USD"
      ? currency(domain.currentValue, domain.unit)
      : `${domain.currentValue}${domain.unit}`;
  const target =
    domain.targetValue === null
      ? null
      : domain.unit === "EUR" || domain.unit === "USD"
        ? currency(domain.targetValue, domain.unit)
        : `${domain.targetValue}${domain.unit}`;

  return target ? `${current} / ${target}` : current;
}

function statusLabel(status: DomainProgress["status"] | undefined) {
  if (status === "on_track") return "On track";
  if (status === "complete") return "Complete";
  if (status === "over_limit") return "Over limit";
  if (status === "behind") return "Behind";
  if (status === "not_started") return "Not started";
  return "Needs log";
}
