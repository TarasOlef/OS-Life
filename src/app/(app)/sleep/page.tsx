"use client";

import { type FormEvent } from "react";
import { Moon, Signal, Sparkles } from "lucide-react";
import { AddEntryDialog } from "@/components/app/add-entry-dialog";
import { DashboardCard } from "@/components/app/dashboard-card";
import { DemoChart } from "@/components/app/demo-chart";
import { EmptyState } from "@/components/app/empty-state";
import { MetricCard } from "@/components/app/metric-card";
import { PageHeader } from "@/components/app/page-header";
import { Button } from "@/components/ui/button";
import { Field, TextInput } from "@/components/forms/form-controls";
import { useDailyLogs } from "@/features/daily-logs/use-daily-logs";
import { getSleepSummary } from "@/features/sleep/calculations";
import { todayIso } from "@/lib/data/dates";

export default function SleepPage() {
  const dailyLogs = useDailyLogs();
  const summary = getSleepSummary(dailyLogs.logs);

  async function handleSubmit(
    event: FormEvent<HTMLFormElement>,
    close: () => void,
  ) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    await dailyLogs.upsertByDate(String(formData.get("date") || todayIso()), {
      sleepHours: nullableNumber(formData.get("sleepHours")),
      sleepQuality: nullableNumber(formData.get("sleepQuality")),
    });
    close();
  }

  return (
    <>
      <PageHeader
        eyebrow="Sleep"
        title="Sleep"
        description="Recovery"
        actions={
          <AddEntryDialog title="Update sleep" triggerLabel="Update sleep">
            {(close) => (
              <form
                className="grid gap-4"
                onSubmit={(event) => handleSubmit(event, close)}
              >
                <Field label="Sleep hours">
                  <TextInput
                    name="sleepHours"
                    type="number"
                    min="0"
                    step="0.25"
                    required
                  />
                </Field>
                <Field label="Date">
                  <TextInput
                    name="date"
                    type="date"
                    defaultValue={todayIso()}
                    required
                  />
                </Field>
                <Field label="Sleep quality 1-10">
                  <TextInput
                    name="sleepQuality"
                    type="number"
                    min="1"
                    max="10"
                    required
                  />
                </Field>
                <Button type="submit">Save sleep</Button>
              </form>
            )}
          </AddEntryDialog>
        }
      />

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
        <MetricCard
          title="Last night"
          value={
            summary.lastNightSleep
              ? `${summary.lastNightSleep.toFixed(1)} h`
              : "Not logged"
          }
          description={summary.recoveryMessage}
          icon={Moon}
        />
        <MetricCard
          title="Weekly sleep average"
          value={
            summary.weeklyAverageSleep
              ? `${summary.weeklyAverageSleep.toFixed(1)} h`
              : "Not logged"
          }
          description="Average over the last seven days."
          icon={Moon}
        />
        <MetricCard
          title="Quality average"
          value={
            summary.weeklyAverageQuality
              ? summary.weeklyAverageQuality.toFixed(1)
              : "Not logged"
          }
          description="Simple 1-10 self rating."
          icon={Sparkles}
        />
        <MetricCard
          title="Consistency"
          value={summary.best && summary.worst ? "Building" : "Pending"}
          description="More logs will improve this signal."
          icon={Signal}
        />
        <MetricCard
          title="Best night"
          value={
            summary.best?.sleepHours
              ? `${summary.best.sleepHours.toFixed(1)} h`
              : "Pending"
          }
          description={summary.best?.date ?? "No weekly sleep yet."}
          icon={Sparkles}
        />
        <MetricCard
          title="Worst night"
          value={
            summary.worst?.sleepHours
              ? `${summary.worst.sleepHours.toFixed(1)} h`
              : "Pending"
          }
          description={summary.worst?.date ?? "No weekly sleep yet."}
          icon={Signal}
        />
      </section>

      <DashboardCard title="Weekly sleep hours">
        {summary.chartData.some((point) => point.score > 0) ? (
          <DemoChart data={summary.chartData} />
        ) : (
          <EmptyState
            title="No sleep data yet"
            description="Update today's sleep to start the weekly chart."
            icon={Moon}
          />
        )}
      </DashboardCard>
    </>
  );
}

function nullableNumber(value: FormDataEntryValue | null) {
  if (typeof value !== "string" || value.trim() === "") return null;
  return Number(value);
}
