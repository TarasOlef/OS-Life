"use client";

import Link from "next/link";
import type { MouseEvent } from "react";
import { ArrowRight, LockKeyhole, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { DashboardCard } from "@/components/app/dashboard-card";
import { isOnboardingCompleted } from "@/features/progress/storage";

export default function Home() {
  return (
    <main className="min-h-screen bg-background px-4 py-6 text-foreground sm:px-6 lg:px-8">
      <div className="mx-auto flex min-h-[calc(100vh-3rem)] w-full max-w-6xl flex-col">
        <header className="flex items-center justify-between border-b border-border pb-5">
          <Link href="/" className="flex items-center gap-3">
            <div className="flex size-10 items-center justify-center rounded-lg border border-border bg-card text-sm font-semibold">
              OS
            </div>
            <div>
              <p className="text-sm font-semibold">OS-Life</p>
              <p className="text-xs text-muted-foreground">
                Private personal dashboard
              </p>
            </div>
          </Link>
          <Button asChild variant="secondary">
            <Link href="/onboarding" onClick={routeFromLocalState}>
              Open OS
              <ArrowRight className="size-4" aria-hidden="true" />
            </Link>
          </Button>
        </header>

        <section className="grid flex-1 items-center gap-10 py-14 lg:grid-cols-[1.1fr_0.9fr]">
          <div className="max-w-3xl">
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground">
              OS-Life
            </p>
            <h1 className="mt-4 text-4xl font-semibold tracking-normal sm:text-6xl">
              Your personal command center.
            </h1>
            <p className="mt-6 max-w-2xl text-base leading-7 text-muted-foreground sm:text-lg">
              A focused Progressive Web App for the parts of life that actually
              need a dashboard: training, nutrition, sleep, body, focus,
              finances, and investments.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Button asChild size="default">
                <Link href="/onboarding" onClick={routeFromLocalState}>
                  Start
                  <ArrowRight className="size-4" aria-hidden="true" />
                </Link>
              </Button>
              <Button asChild variant="outline">
                <Link href="/settings">View setup notes</Link>
              </Button>
            </div>
          </div>

          <div className="grid gap-4">
            <DashboardCard title="Login placeholder">
              <p className="text-sm leading-6 text-muted-foreground">
                Authentication is intentionally not faked. This sprint uses
                local browser data so the product can feel useful before a
                backend is connected.
              </p>
            </DashboardCard>
            <DashboardCard title="Public repo safe">
              <div className="space-y-4">
                <div className="flex gap-3">
                  <ShieldCheck
                    className="mt-0.5 size-5 text-emerald-300"
                    aria-hidden="true"
                  />
                  <p className="text-sm leading-6 text-muted-foreground">
                    Secret API keys are server-only and are not committed.
                  </p>
                </div>
                <div className="flex gap-3">
                  <LockKeyhole
                    className="mt-0.5 size-5 text-sky-300"
                    aria-hidden="true"
                  />
                  <p className="text-sm leading-6 text-muted-foreground">
                    OpenAI and market data integrations are planned behind
                    server-side routes, not browser code.
                  </p>
                </div>
              </div>
            </DashboardCard>
          </div>
        </section>
      </div>
    </main>
  );
}

function routeFromLocalState(event: MouseEvent<HTMLAnchorElement>) {
  event.preventDefault();
  window.location.href = isOnboardingCompleted() ? "/dashboard" : "/onboarding";
}
