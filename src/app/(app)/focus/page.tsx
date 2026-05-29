"use client";

import { type FormEvent } from "react";
import { FolderKanban, Gauge, Timer, Trash2 } from "lucide-react";
import { AddEntryDialog } from "@/components/app/add-entry-dialog";
import { DashboardCard } from "@/components/app/dashboard-card";
import { DemoChart } from "@/components/app/demo-chart";
import { EmptyState } from "@/components/app/empty-state";
import { MetricCard } from "@/components/app/metric-card";
import { PageHeader } from "@/components/app/page-header";
import { Button } from "@/components/ui/button";
import { Field, TextInput } from "@/components/forms/form-controls";
import { useFocus } from "@/features/focus/use-focus";
import { lastNDays, todayIso } from "@/lib/data/dates";
import { sum } from "@/lib/data/format";

export default function FocusPage() {
  const focus = useFocus();
  const todaySessions = focus.items.filter((item) => item.date === todayIso());
  const todayMinutes = sum(todaySessions.map((item) => item.durationMinutes));
  const weekDates = lastNDays(7);
  const weeklyMinutes = sum(
    focus.items
      .filter((item) => weekDates.includes(item.date))
      .map((item) => item.durationMinutes),
  );
  const activeProject =
    todaySessions.find((item) => item.project)?.project ?? "Not set";
  const chartData = weekDates.map((date) => ({
    day: new Date(`${date}T00:00:00`).toLocaleDateString("en-US", {
      weekday: "short",
    }),
    score: sum(
      focus.items
        .filter((item) => item.date === date)
        .map((item) => item.durationMinutes),
    ),
  }));

  async function handleSubmit(
    event: FormEvent<HTMLFormElement>,
    close: () => void,
  ) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    await focus.create({
      date: String(formData.get("date") || todayIso()),
      title: nullableText(formData.get("title")),
      durationMinutes: Number(formData.get("durationMinutes") || 0),
      project: nullableText(formData.get("project")),
      qualityScore: nullableNumber(formData.get("qualityScore")),
    });
    close();
  }

  return (
    <>
      <PageHeader
        eyebrow="Focus"
        title="Deep work and execution."
        description="Log focused sessions locally with project and quality context."
        actions={
          <AddEntryDialog title="Add focus session" triggerLabel="Add session">
            {(close) => (
              <form
                className="grid gap-4"
                onSubmit={(event) => handleSubmit(event, close)}
              >
                <div className="grid gap-4 sm:grid-cols-2">
                  <Field label="Title">
                    <TextInput name="title" placeholder="Build sprint plan" />
                  </Field>
                  <Field label="Date">
                    <TextInput
                      name="date"
                      type="date"
                      defaultValue={todayIso()}
                    />
                  </Field>
                  <Field label="Duration minutes">
                    <TextInput
                      name="durationMinutes"
                      type="number"
                      min="1"
                      required
                    />
                  </Field>
                  <Field label="Project">
                    <TextInput name="project" placeholder="OS-Life" />
                  </Field>
                  <Field label="Quality score">
                    <TextInput
                      name="qualityScore"
                      type="number"
                      min="1"
                      max="10"
                    />
                  </Field>
                </div>
                <Button type="submit">Save session</Button>
              </form>
            )}
          </AddEntryDialog>
        }
      />

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        <MetricCard
          title="Today focus"
          value={`${todayMinutes} min`}
          description="Logged today."
          icon={Timer}
        />
        <MetricCard
          title="Weekly focus"
          value={`${weeklyMinutes} min`}
          description="Last seven days."
          icon={Gauge}
        />
        <MetricCard
          title="Active project"
          value={activeProject}
          description="From today's sessions."
          icon={FolderKanban}
        />
      </section>

      <section className="grid gap-4 lg:grid-cols-2">
        <DashboardCard title="Weekly focus minutes">
          {chartData.some((point) => point.score > 0) ? (
            <DemoChart data={chartData} />
          ) : (
            <EmptyState
              title="No focus data"
              description="Add a focus session to build the weekly chart."
              icon={Timer}
            />
          )}
        </DashboardCard>
        <DashboardCard title="Sessions">
          {focus.items.length > 0 ? (
            <div className="space-y-3">
              {focus.items.map((session) => (
                <div
                  key={session.id}
                  className="flex justify-between gap-3 rounded-md border border-border bg-secondary/30 p-3"
                >
                  <div>
                    <p className="font-medium">
                      {session.title ?? "Focus session"}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {session.date} | {session.durationMinutes} min |{" "}
                      {session.project ?? "No project"}
                    </p>
                  </div>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={() => void focus.remove(session.id)}
                    aria-label="Delete session"
                  >
                    <Trash2 className="size-4" aria-hidden="true" />
                  </Button>
                </div>
              ))}
            </div>
          ) : (
            <EmptyState
              title="No sessions yet"
              description="Log a focus session to track execution."
              icon={Timer}
            />
          )}
        </DashboardCard>
      </section>
    </>
  );
}

function nullableNumber(value: FormDataEntryValue | null) {
  if (typeof value !== "string" || value.trim() === "") return null;
  return Number(value);
}

function nullableText(value: FormDataEntryValue | null) {
  if (typeof value !== "string" || value.trim() === "") return null;
  return value.trim();
}
