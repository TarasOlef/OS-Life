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
import { lastNDays, todayIso } from "@/lib/data/dates";
import { average } from "@/lib/data/format";

export default function SleepPage() {
  const dailyLogs = useDailyLogs();
  const sleepLogs = dailyLogs.logs.filter((log) => log.sleepHours !== null);
  const weekDates = lastNDays(7);
  const weeklyLogs = weekDates
    .map((date) => dailyLogs.logs.find((log) => log.date === date))
    .filter(Boolean);
  const weeklyAverage = average(weeklyLogs.map((log) => log?.sleepHours));
  const qualityAverage = average(weeklyLogs.map((log) => log?.sleepQuality));
  const chartData = weekDates.map((date) => ({
    day: new Date(`${date}T00:00:00`).toLocaleDateString("en-US", {
      weekday: "short",
    }),
    score: dailyLogs.logs.find((log) => log.date === date)?.sleepHours ?? 0,
  }));

  async function handleSubmit(
    event: FormEvent<HTMLFormElement>,
    close: () => void,
  ) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    await dailyLogs.upsertByDate(todayIso(), {
      sleepHours: nullableNumber(formData.get("sleepHours")),
      sleepQuality: nullableNumber(formData.get("sleepQuality")),
    });
    close();
  }

  return (
    <>
      <PageHeader
        eyebrow="Sleep"
        title="Sleep and recovery."
        description="Add or update today's sleep locally. The dashboard reads from the same daily log."
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

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        <MetricCard
          title="Weekly sleep average"
          value={weeklyAverage ? `${weeklyAverage.toFixed(1)} h` : "Not logged"}
          description="Average over the last seven days."
          icon={Moon}
        />
        <MetricCard
          title="Quality average"
          value={qualityAverage ? qualityAverage.toFixed(1) : "Not logged"}
          description="Simple 1-10 self rating."
          icon={Sparkles}
        />
        <MetricCard
          title="Consistency"
          value={sleepLogs.length >= 3 ? "Building" : "Pending"}
          description="More logs will improve this signal."
          icon={Signal}
        />
      </section>

      <DashboardCard title="Weekly sleep hours">
        {chartData.some((point) => point.score > 0) ? (
          <DemoChart data={chartData} />
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
