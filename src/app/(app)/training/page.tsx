"use client";

import { useState, type FormEvent } from "react";
import { Dumbbell, ListChecks, Trash2, Trophy } from "lucide-react";
import { z } from "zod";
import { AddEntryDialog } from "@/components/app/add-entry-dialog";
import { EmptyState } from "@/components/app/empty-state";
import { MetricCard } from "@/components/app/metric-card";
import { PageHeader } from "@/components/app/page-header";
import { DashboardCard } from "@/components/app/dashboard-card";
import { Button } from "@/components/ui/button";
import { Field, TextArea, TextInput } from "@/components/forms/form-controls";
import { getTrainingSummary } from "@/features/training/calculations";
import { useTraining } from "@/features/training/use-training";
import { todayIso } from "@/lib/data/dates";
import type { TrainingSet } from "@/lib/data/schemas";

const workoutSchema = z.object({
  date: z.string().min(1),
  title: z.string().trim().min(1),
  durationMinutes: z.coerce.number().finite().nonnegative().nullable(),
  perceivedEffort: z.coerce.number().finite().min(1).max(10).nullable(),
  notes: z.string().trim().nullable(),
});

export default function TrainingPage() {
  const training = useTraining();
  const [error, setError] = useState<string | null>(null);
  const [setRows, setSetRows] = useState([0]);
  const summary = getTrainingSummary(training.items);

  async function handleSubmit(
    event: FormEvent<HTMLFormElement>,
    close: () => void,
  ) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const parsed = workoutSchema.safeParse({
      date: String(formData.get("date") || todayIso()),
      title: String(formData.get("title") || ""),
      durationMinutes: nullableNumber(formData.get("durationMinutes")),
      perceivedEffort: nullableNumber(formData.get("perceivedEffort")),
      notes: nullableText(formData.get("notes")),
    });

    if (!parsed.success) {
      setError("Add a title and check the workout values.");
      return;
    }

    const exerciseNames = formData.getAll("exerciseName");
    const muscleGroups = formData.getAll("muscleGroup");
    const setNumbers = formData.getAll("setNumber");
    const reps = formData.getAll("reps");
    const weights = formData.getAll("weightKg");
    const rirs = formData.getAll("rir");

    const set: TrainingSet[] = exerciseNames
      .map((value, index) => ({
        id: crypto.randomUUID(),
        exerciseName: typeof value === "string" ? value.trim() : "",
        muscleGroup: nullableText(muscleGroups[index] ?? null),
        setNumber: nullableNumber(setNumbers[index] ?? null) ?? index + 1,
        reps: nullableNumber(reps[index] ?? null),
        weightKg: nullableNumber(weights[index] ?? null),
        rir: nullableNumber(rirs[index] ?? null),
        createdAt: new Date().toISOString(),
      }))
      .filter((row) => row.exerciseName.length > 0);

    await training.create({
      date: parsed.data.date,
      title: parsed.data.title,
      durationMinutes: parsed.data.durationMinutes,
      perceivedEffort: parsed.data.perceivedEffort,
      notes: parsed.data.notes,
      sets: set,
    });
    setError(null);
    setSetRows([0]);
    close();
  }

  return (
    <>
      <PageHeader
        eyebrow="Training"
        title="Training"
        description="Week, volume, PRs"
        actions={
          <AddEntryDialog title="Add workout" triggerLabel="Add workout">
            {(close) => (
              <form
                className="grid gap-4"
                onSubmit={(event) => handleSubmit(event, close)}
              >
                <div className="grid gap-4 sm:grid-cols-2">
                  <Field label="Title">
                    <TextInput name="title" placeholder="Upper body" required />
                  </Field>
                  <Field label="Date">
                    <TextInput
                      name="date"
                      type="date"
                      defaultValue={todayIso()}
                    />
                  </Field>
                  <Field label="Duration">
                    <TextInput name="durationMinutes" type="number" min="0" />
                  </Field>
                  <Field label="Perceived effort">
                    <TextInput
                      name="perceivedEffort"
                      type="number"
                      min="1"
                      max="10"
                    />
                  </Field>
                </div>
                <div className="grid gap-3 rounded-md border border-border p-4">
                  <div className="flex items-center justify-between gap-3">
                    <p className="text-sm font-medium">Sets</p>
                    <Button
                      type="button"
                      variant="secondary"
                      onClick={() =>
                        setSetRows((rows) => [...rows, Date.now()])
                      }
                    >
                      Add set
                    </Button>
                  </div>
                  {setRows.map((row, index) => (
                    <div
                      key={row}
                      className="grid gap-3 rounded-md bg-secondary/30 p-3 sm:grid-cols-6"
                    >
                      <Field label="Exercise">
                        <TextInput
                          name="exerciseName"
                          placeholder="Bench press"
                        />
                      </Field>
                      <Field label="Muscle">
                        <TextInput name="muscleGroup" placeholder="Chest" />
                      </Field>
                      <Field label="Set">
                        <TextInput
                          name="setNumber"
                          type="number"
                          min="1"
                          defaultValue={index + 1}
                        />
                      </Field>
                      <Field label="Reps">
                        <TextInput name="reps" type="number" min="0" />
                      </Field>
                      <Field label="Weight">
                        <TextInput
                          name="weightKg"
                          type="number"
                          min="0"
                          step="0.5"
                        />
                      </Field>
                      <Field label="RIR">
                        <TextInput name="rir" type="number" min="0" />
                      </Field>
                    </div>
                  ))}
                </div>
                <Field label="Notes">
                  <TextArea name="notes" />
                </Field>
                {error ? (
                  <p className="text-sm text-destructive">{error}</p>
                ) : null}
                <Button type="submit">Save workout</Button>
              </form>
            )}
          </AddEntryDialog>
        }
      />

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <MetricCard
          title="Last workout"
          value={summary.latest?.title ?? "No session"}
          description={summary.latest?.date ?? "Nothing logged yet."}
          icon={Dumbbell}
        />
        <MetricCard
          title="Weekly sessions"
          value={String(summary.weeklySessions.length)}
          description="Sessions this week."
          icon={ListChecks}
        />
        <MetricCard
          title="Total sets"
          value={String(summary.totalSets)}
          description="Sets logged this week."
          icon={ListChecks}
        />
        <MetricCard
          title="Weekly volume"
          value={`${Math.round(summary.totalVolume)} kg`}
          description="Estimated reps x weight."
          icon={ListChecks}
        />
        <MetricCard
          title="Avg effort"
          value={
            summary.averageEffort ? summary.averageEffort.toFixed(1) : "Pending"
          }
          description="Average perceived effort this week."
          icon={Trophy}
        />
      </section>

      <DashboardCard title="PRs">
        {summary.prs.length > 0 ? (
          <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
            {summary.prs.slice(0, 6).map((pr) => (
              <div
                key={pr.exercise}
                className="rounded-md border border-border bg-secondary/30 px-3 py-2 text-sm"
              >
                <p className="font-medium">{pr.exercise}</p>
                <p className="text-muted-foreground">{pr.weight} kg</p>
              </div>
            ))}
          </div>
        ) : (
          <EmptyState
            title="No PR data yet"
            description="Add weighted sets to build max-weight summaries."
            icon={Trophy}
          />
        )}
      </DashboardCard>

      <DashboardCard title="Workout sessions">
        {training.items.length > 0 ? (
          <div className="space-y-3">
            {training.items.map((session) => (
              <div
                key={session.id}
                className="rounded-md border border-border bg-secondary/30 p-4"
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="font-medium">{session.title}</p>
                    <p className="text-sm text-muted-foreground">
                      {session.date} | {session.durationMinutes ?? 0} min |
                      effort {session.perceivedEffort ?? "not set"}
                    </p>
                  </div>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={() => void training.remove(session.id)}
                    aria-label="Delete workout"
                  >
                    <Trash2 className="size-4" aria-hidden="true" />
                  </Button>
                </div>
                {session.sets.length > 0 ? (
                  <div className="mt-3 text-sm text-muted-foreground">
                    {session.sets.map((set) => (
                      <p key={set.id}>
                        Set {set.setNumber} | {set.exerciseName}:{" "}
                        {set.reps ?? 0} reps x {set.weightKg ?? 0} kg | RIR{" "}
                        {set.rir ?? "not set"}
                      </p>
                    ))}
                  </div>
                ) : null}
              </div>
            ))}
          </div>
        ) : (
          <EmptyState
            title="No training sessions yet"
            description="Add your first workout to start tracking weekly sessions and volume."
            icon={Dumbbell}
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

function nullableText(value: FormDataEntryValue | null) {
  if (typeof value !== "string" || value.trim() === "") return null;
  return value.trim();
}
