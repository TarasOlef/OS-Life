"use client";

import { type FormEvent } from "react";
import { Camera, Ruler, Trash2, TrendingUp, Weight } from "lucide-react";
import { AddEntryDialog } from "@/components/app/add-entry-dialog";
import { DashboardCard } from "@/components/app/dashboard-card";
import { DemoChart } from "@/components/app/demo-chart";
import { EmptyState } from "@/components/app/empty-state";
import { MetricCard } from "@/components/app/metric-card";
import { PageHeader } from "@/components/app/page-header";
import { Button } from "@/components/ui/button";
import { Field, TextArea, TextInput } from "@/components/forms/form-controls";
import { getBodySummary } from "@/features/body/calculations";
import { useBody } from "@/features/body/use-body";
import { todayIso } from "@/lib/data/dates";
import { formatNumber } from "@/lib/data/format";

export default function BodyPage() {
  const body = useBody();
  const summary = getBodySummary(body.items);

  async function handleSubmit(
    event: FormEvent<HTMLFormElement>,
    close: () => void,
  ) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    await body.create({
      date: String(formData.get("date") || todayIso()),
      weightKg: nullableNumber(formData.get("weightKg")),
      waistCm: nullableNumber(formData.get("waistCm")),
      chestCm: nullableNumber(formData.get("chestCm")),
      armCm: nullableNumber(formData.get("armCm")),
      bodyPhotoUrl: null,
      notes: nullableText(formData.get("notes")),
    });
    close();
  }

  return (
    <>
      <PageHeader
        eyebrow="Body"
        title="Body"
        description="Weight and measurements"
        actions={
          <AddEntryDialog title="Add body check-in" triggerLabel="Add check-in">
            {(close) => (
              <form
                className="grid gap-4"
                onSubmit={(event) => handleSubmit(event, close)}
              >
                <Field label="Date">
                  <TextInput
                    name="date"
                    type="date"
                    defaultValue={todayIso()}
                  />
                </Field>
                <div className="grid gap-4 sm:grid-cols-2">
                  <Field label="Weight kg">
                    <TextInput name="weightKg" type="number" step="0.1" />
                  </Field>
                  <Field label="Waist cm">
                    <TextInput name="waistCm" type="number" step="0.1" />
                  </Field>
                  <Field label="Chest cm">
                    <TextInput name="chestCm" type="number" step="0.1" />
                  </Field>
                  <Field label="Arm cm">
                    <TextInput name="armCm" type="number" step="0.1" />
                  </Field>
                </div>
                <Field label="Notes">
                  <TextArea name="notes" />
                </Field>
                <Button type="submit">Save check-in</Button>
              </form>
            )}
          </AddEntryDialog>
        }
      />

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <MetricCard
          title="Latest weight"
          value={formatNumber(summary.latest?.weightKg, " kg")}
          description={summary.latest?.date ?? "No check-in yet."}
          icon={Weight}
        />
        <MetricCard
          title="Waist"
          value={formatNumber(summary.latest?.waistCm, " cm")}
          description="Latest measurement."
          icon={Ruler}
        />
        <MetricCard
          title="Weight trend"
          value={
            summary.weightChange === null
              ? "Pending"
              : `${summary.weightChange > 0 ? "+" : ""}${summary.weightChange.toFixed(1)} kg`
          }
          description="Compared with previous check-in."
          icon={TrendingUp}
        />
        <MetricCard
          title="Check-ins this month"
          value={String(summary.checkinsThisMonth)}
          description="Local body entries this month."
          icon={Camera}
        />
      </section>

      <section className="grid gap-4 lg:grid-cols-2">
        <DashboardCard title="Weight trend">
          {summary.chartData.some((point) => point.score > 0) ? (
            <DemoChart data={summary.chartData} />
          ) : (
            <EmptyState
              title="No body trend yet"
              description="Add a weight check-in to start the chart."
              icon={Weight}
            />
          )}
        </DashboardCard>

        <DashboardCard title="Check-ins">
          {body.items.length > 0 ? (
            <div className="space-y-3">
              {body.items.map((checkin) => (
                <div
                  key={checkin.id}
                  className="flex justify-between gap-3 rounded-md border border-border bg-secondary/30 p-3"
                >
                  <div>
                    <p className="font-medium">{checkin.date}</p>
                    <p className="text-sm text-muted-foreground">
                      {checkin.weightKg ?? 0} kg | waist{" "}
                      {checkin.waistCm ?? "not set"} cm
                    </p>
                    {checkin.notes ? (
                      <p className="mt-1 text-sm text-muted-foreground">
                        {checkin.notes}
                      </p>
                    ) : null}
                  </div>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={() => void body.remove(checkin.id)}
                    aria-label="Delete check-in"
                  >
                    <Trash2 className="size-4" aria-hidden="true" />
                  </Button>
                </div>
              ))}
            </div>
          ) : (
            <EmptyState
              title="No check-ins yet"
              description="Add weight and measurements to start tracking body changes."
              icon={Camera}
            />
          )}
        </DashboardCard>
      </section>

      <DashboardCard title="Measurements summary">
        <div className="grid gap-2 text-sm sm:grid-cols-3">
          <div className="rounded-md bg-secondary/30 px-3 py-2">
            Chest: {formatNumber(summary.latest?.chestCm, " cm")}
          </div>
          <div className="rounded-md bg-secondary/30 px-3 py-2">
            Waist: {formatNumber(summary.latest?.waistCm, " cm")}
          </div>
          <div className="rounded-md bg-secondary/30 px-3 py-2">
            Arm: {formatNumber(summary.latest?.armCm, " cm")}
          </div>
        </div>
      </DashboardCard>

      <DashboardCard title="AI physique">
        <div className="rounded-lg border border-dashed border-border bg-secondary/30 p-6 text-center">
          <Camera
            className="mx-auto size-8 text-muted-foreground"
            aria-hidden="true"
          />
          <p className="mt-4 text-sm leading-6 text-muted-foreground">
            Photo feedback
            <span className="ml-2 text-muted-foreground">Soon</span>
          </p>
        </div>
      </DashboardCard>
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
