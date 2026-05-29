"use client";

import { type FormEvent } from "react";
import { BriefcaseBusiness, Clock, Target, Trash2 } from "lucide-react";
import { AddEntryDialog } from "@/components/app/add-entry-dialog";
import { DashboardCard } from "@/components/app/dashboard-card";
import { EmptyState } from "@/components/app/empty-state";
import { MetricCard } from "@/components/app/metric-card";
import { PageHeader } from "@/components/app/page-header";
import { Button } from "@/components/ui/button";
import { Field, TextArea, TextInput } from "@/components/forms/form-controls";
import { useBusiness } from "@/features/business/use-business";
import { useProgress } from "@/features/progress/use-progress";
import { isThisWeek, todayIso } from "@/lib/data/dates";
import { sum } from "@/lib/data/format";

export default function BusinessPage() {
  const business = useBusiness();
  const progress = useProgress();
  const weeklyMinutes = sum(
    business.items
      .filter((log) => isThisWeek(log.date))
      .map((log) => log.durationMinutes),
  );
  const weeklyHours = Math.round((weeklyMinutes / 60) * 10) / 10;
  const targetHours = progress.targets?.business.hoursPerWeek ?? 0;

  async function handleSubmit(
    event: FormEvent<HTMLFormElement>,
    close: () => void,
  ) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    await business.create({
      date: String(formData.get("date") || todayIso()),
      title: nullableText(formData.get("title")),
      durationMinutes: Number(formData.get("durationMinutes") || 0),
      category: String(formData.get("category") || "Execution"),
      notes: nullableText(formData.get("notes")),
    });
    close();
  }

  return (
    <>
      <PageHeader
        eyebrow="Business"
        title="Business"
        description="Execution"
        actions={
          <AddEntryDialog title="Add business log" triggerLabel="Add log">
            {(close) => (
              <form
                className="grid gap-4"
                onSubmit={(event) => handleSubmit(event, close)}
              >
                <div className="grid gap-4 sm:grid-cols-2">
                  <Field label="Title">
                    <TextInput name="title" placeholder="MVP block" />
                  </Field>
                  <Field label="Date">
                    <TextInput
                      name="date"
                      type="date"
                      defaultValue={todayIso()}
                    />
                  </Field>
                  <Field label="Minutes">
                    <TextInput
                      name="durationMinutes"
                      type="number"
                      min="1"
                      required
                    />
                  </Field>
                  <Field label="Category">
                    <TextInput name="category" placeholder="Build" />
                  </Field>
                </div>
                <Field label="Notes">
                  <TextArea name="notes" />
                </Field>
                <Button type="submit">Save log</Button>
              </form>
            )}
          </AddEntryDialog>
        }
      />

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <MetricCard
          title="Week"
          value={`${weeklyHours}/${targetHours || "--"} h`}
          description="Business execution."
          icon={Clock}
        />
        <MetricCard
          title="Priority"
          value={progress.targets?.business.priority ?? "Set target"}
          description="From onboarding."
          icon={Target}
        />
        <MetricCard
          title="Revenue target"
          value={
            progress.targets?.business.targetMonthlyRevenue
              ? `€${progress.targets.business.targetMonthlyRevenue}`
              : "--"
          }
          description="Monthly goal."
          icon={BriefcaseBusiness}
        />
        <MetricCard
          title="Logs"
          value={String(business.items.length)}
          description="Local entries."
          icon={BriefcaseBusiness}
        />
      </section>

      <DashboardCard title="Business logs">
        {business.items.length > 0 ? (
          <div className="space-y-3">
            {business.items.map((log) => (
              <div
                key={log.id}
                className="flex justify-between gap-3 rounded-md border border-border bg-secondary/30 p-3"
              >
                <div>
                  <p className="font-medium">{log.title ?? log.category}</p>
                  <p className="text-sm text-muted-foreground">
                    {log.date} | {log.durationMinutes} min | {log.category}
                  </p>
                </div>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  onClick={() => void business.remove(log.id)}
                  aria-label="Delete business log"
                >
                  <Trash2 className="size-4" aria-hidden="true" />
                </Button>
              </div>
            ))}
          </div>
        ) : (
          <EmptyState
            title="No business logs"
            description="Log your first execution block."
            icon={BriefcaseBusiness}
          />
        )}
      </DashboardCard>
    </>
  );
}

function nullableText(value: FormDataEntryValue | null) {
  if (typeof value !== "string" || value.trim() === "") return null;
  return value.trim();
}
