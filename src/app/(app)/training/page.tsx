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
import { useTraining } from "@/features/training/use-training";
import { isThisWeek, todayIso } from "@/lib/data/dates";
import type { TrainingSet } from "@/lib/data/schemas";

const workoutSchema = z.object({
  date: z.string().min(1),
  title: z.string().trim().min(1),
  durationMinutes: z.coerce.number().finite().nonnegative().nullable(),
  perceivedEffort: z.coerce.number().finite().min(1).max(10).nullable(),
  notes: z.string().trim().nullable(),
  exerciseName: z.string().trim().nullable(),
  muscleGroup: z.string().trim().nullable(),
  reps: z.coerce.number().finite().nonnegative().nullable(),
  weightKg: z.coerce.number().finite().nonnegative().nullable(),
  rir: z.coerce.number().finite().nonnegative().nullable(),
});

export default function TrainingPage() {
  const training = useTraining();
  const [error, setError] = useState<string | null>(null);
  const weeklySessions = training.items.filter((session) =>
    isThisWeek(session.date),
  );
  const weeklyVolume = weeklySessions.reduce(
    (total, session) =>
      total +
      session.sets.reduce(
        (setTotal, set) => setTotal + (set.reps ?? 0) * (set.weightKg ?? 0),
        0,
      ),
    0,
  );
  const maxWeight = getMaxWeight(
    training.items.flatMap((session) => session.sets),
  );

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
      exerciseName: nullableText(formData.get("exerciseName")),
      muscleGroup: nullableText(formData.get("muscleGroup")),
      reps: nullableNumber(formData.get("reps")),
      weightKg: nullableNumber(formData.get("weightKg")),
      rir: nullableNumber(formData.get("rir")),
    });

    if (!parsed.success) {
      setError("Add a title and check the workout values.");
      return;
    }

    const set: TrainingSet[] = parsed.data.exerciseName
      ? [
          {
            id: crypto.randomUUID(),
            exerciseName: parsed.data.exerciseName,
            muscleGroup: parsed.data.muscleGroup,
            setNumber: 1,
            reps: parsed.data.reps,
            weightKg: parsed.data.weightKg,
            rir: parsed.data.rir,
            createdAt: new Date().toISOString(),
          },
        ]
      : [];

    await training.create({
      date: parsed.data.date,
      title: parsed.data.title,
      durationMinutes: parsed.data.durationMinutes,
      perceivedEffort: parsed.data.perceivedEffort,
      notes: parsed.data.notes,
      sets: set,
    });
    setError(null);
    close();
  }

  return (
    <>
      <PageHeader
        eyebrow="Training"
        title="Workouts and progression."
        description="Log sessions locally with a basic first set and simple volume signals."
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
                <div className="grid gap-4 rounded-md border border-border p-4 sm:grid-cols-2">
                  <Field label="Exercise">
                    <TextInput name="exerciseName" placeholder="Bench press" />
                  </Field>
                  <Field label="Muscle group">
                    <TextInput name="muscleGroup" placeholder="Chest" />
                  </Field>
                  <Field label="Reps">
                    <TextInput name="reps" type="number" min="0" />
                  </Field>
                  <Field label="Weight kg">
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
          value={training.items[0]?.title ?? "No session"}
          description={training.items[0]?.date ?? "Nothing logged yet."}
          icon={Dumbbell}
        />
        <MetricCard
          title="Weekly sessions"
          value={String(weeklySessions.length)}
          description="Sessions this week."
          icon={ListChecks}
        />
        <MetricCard
          title="Weekly volume"
          value={`${Math.round(weeklyVolume)} kg`}
          description="Estimated reps x weight."
          icon={ListChecks}
        />
        <MetricCard
          title="PR signal"
          value={
            maxWeight
              ? `${maxWeight.exercise}: ${maxWeight.weight} kg`
              : "Pending"
          }
          description="Max logged weight by exercise."
          icon={Trophy}
        />
      </section>

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
                        {set.exerciseName}: {set.reps ?? 0} reps x{" "}
                        {set.weightKg ?? 0} kg
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

function getMaxWeight(sets: TrainingSet[]) {
  const weighted = sets.filter((set) => set.weightKg && set.weightKg > 0);
  const top = weighted.sort((a, b) => (b.weightKg ?? 0) - (a.weightKg ?? 0))[0];
  return top ? { exercise: top.exerciseName, weight: top.weightKg ?? 0 } : null;
}

function nullableNumber(value: FormDataEntryValue | null) {
  if (typeof value !== "string" || value.trim() === "") return null;
  return Number(value);
}

function nullableText(value: FormDataEntryValue | null) {
  if (typeof value !== "string" || value.trim() === "") return null;
  return value.trim();
}
