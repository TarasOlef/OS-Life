"use client";

import { useState, type FormEvent } from "react";
import {
  Banknote,
  BriefcaseBusiness,
  Dumbbell,
  Landmark,
  Moon,
  Plus,
  Target,
  Utensils,
  Weight,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Field, TextInput } from "@/components/forms/form-controls";
import type { useProgress } from "@/features/progress/use-progress";
import { todayIso } from "@/lib/data/dates";
import { cn } from "@/lib/utils";

type ProgressRepositories = ReturnType<typeof useProgress>["repositories"];
type LogType =
  | "meal"
  | "workout"
  | "sleep"
  | "body"
  | "focus"
  | "transaction"
  | "investment"
  | "business";

const options: Array<{
  type: LogType;
  label: string;
  icon: typeof Utensils;
}> = [
  { type: "meal", label: "Meal", icon: Utensils },
  { type: "workout", label: "Workout", icon: Dumbbell },
  { type: "sleep", label: "Sleep", icon: Moon },
  { type: "body", label: "Body", icon: Weight },
  { type: "focus", label: "Focus", icon: Target },
  { type: "transaction", label: "Transaction", icon: Banknote },
  { type: "investment", label: "Investment", icon: Landmark },
  { type: "business", label: "Business", icon: BriefcaseBusiness },
];

export function GlobalLogSheet({
  repositories,
}: {
  repositories: ProgressRepositories;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [type, setType] = useState<LogType>("meal");
  const [error, setError] = useState<string | null>(null);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const date = text(form.get("date")) ?? todayIso();

    try {
      if (type === "meal") {
        await repositories.nutrition.create({
          date,
          mealName: text(form.get("title")),
          calories: number(form.get("calories")),
          proteinG: number(form.get("protein")),
          carbsG: number(form.get("carbs")),
          fatG: number(form.get("fat")),
          imageUrl: null,
          aiEstimated: false,
          notes: text(form.get("notes")),
        });
      }

      if (type === "workout") {
        await repositories.training.create({
          date,
          title: text(form.get("title")) ?? "Workout",
          durationMinutes: number(form.get("duration")),
          perceivedEffort: number(form.get("quality")),
          notes: text(form.get("notes")),
          sets: [],
        });
      }

      if (type === "sleep") {
        await repositories.dailyLogs.upsertByDate(date, {
          sleepHours: number(form.get("hours")),
          sleepQuality: number(form.get("quality")),
        });
      }

      if (type === "body") {
        await repositories.body.create({
          date,
          weightKg: number(form.get("weight")),
          waistCm: number(form.get("waist")),
          chestCm: null,
          armCm: null,
          bodyPhotoUrl: null,
          notes: text(form.get("notes")),
        });
      }

      if (type === "focus") {
        await repositories.focus.create({
          date,
          title: text(form.get("title")),
          durationMinutes: number(form.get("duration")) ?? 25,
          project: text(form.get("project")),
          qualityScore: number(form.get("quality")),
        });
      }

      if (type === "transaction") {
        await repositories.finances.create({
          date,
          amount: number(form.get("amount")) ?? 0,
          currency: text(form.get("currency")) ?? "EUR",
          category: text(form.get("category")) ?? "General",
          description: text(form.get("notes")),
        });
      }

      if (type === "investment") {
        await repositories.investments.create({
          symbol: text(form.get("symbol")) ?? "ASSET",
          assetName: text(form.get("title")),
          quantity: number(form.get("quantity")) ?? 1,
          averageBuyPrice: number(form.get("averageBuyPrice")),
          currentPrice: number(form.get("currentPrice")),
          currency: text(form.get("currency")) ?? "USD",
        });
      }

      if (type === "business") {
        await repositories.business.create({
          date,
          title: text(form.get("title")),
          durationMinutes: number(form.get("duration")) ?? 30,
          category: text(form.get("category")) ?? "Execution",
          notes: text(form.get("notes")),
        });
      }

      setError(null);
      setIsOpen(false);
    } catch {
      setError("Check the fields.");
    }
  }

  return (
    <>
      <Button type="button" onClick={() => setIsOpen(true)}>
        <Plus className="size-4" aria-hidden="true" />
        Log
      </Button>
      {isOpen ? (
        <div className="fixed inset-0 z-50 flex items-end justify-center bg-background/70 p-3 backdrop-blur-xl sm:items-center">
          <div className="os-animate-sheet max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-[1.75rem] border border-border/70 bg-card p-5 shadow-2xl">
            <div className="flex items-center justify-between gap-4">
              <h2 className="text-2xl font-semibold tracking-tight">Log</h2>
              <Button
                type="button"
                variant="ghost"
                size="icon"
                onClick={() => setIsOpen(false)}
                aria-label="Close"
              >
                <X className="size-4" aria-hidden="true" />
              </Button>
            </div>

            <div className="mt-5 grid grid-cols-4 gap-2">
              {options.map((option) => {
                const Icon = option.icon;
                return (
                  <button
                    key={option.type}
                    type="button"
                    onClick={() => setType(option.type)}
                    className={cn(
                      "grid gap-2 rounded-[1.15rem] bg-secondary/50 p-3 text-center text-xs font-semibold text-muted-foreground transition active:scale-[0.98]",
                      type === option.type && "bg-foreground text-background",
                    )}
                  >
                    <Icon className="mx-auto size-5" aria-hidden="true" />
                    {option.label}
                  </button>
                );
              })}
            </div>

            <form className="mt-5 grid gap-4" onSubmit={submit}>
              <Field label="Date">
                <TextInput name="date" type="date" defaultValue={todayIso()} />
              </Field>
              {renderFields(type)}
              {error ? (
                <p className="text-sm text-destructive">{error}</p>
              ) : null}
              <div className="grid grid-cols-2 gap-3">
                <Button
                  type="button"
                  variant="secondary"
                  onClick={() => setIsOpen(false)}
                >
                  Cancel
                </Button>
                <Button type="submit">Save</Button>
              </div>
            </form>
          </div>
        </div>
      ) : null}
    </>
  );
}

function renderFields(type: LogType) {
  if (type === "meal") {
    return (
      <>
        <Field label="Meal">
          <TextInput name="title" placeholder="Chicken bowl" />
        </Field>
        <div className="grid grid-cols-2 gap-3">
          <NumberInput name="calories" label="Calories" />
          <NumberInput name="protein" label="Protein" />
          <NumberInput name="carbs" label="Carbs" />
          <NumberInput name="fat" label="Fat" />
        </div>
      </>
    );
  }

  if (type === "workout") {
    return (
      <>
        <Field label="Workout">
          <TextInput name="title" placeholder="Upper body" />
        </Field>
        <div className="grid grid-cols-2 gap-3">
          <NumberInput name="duration" label="Minutes" />
          <NumberInput name="quality" label="Effort" />
        </div>
      </>
    );
  }

  if (type === "sleep") {
    return (
      <div className="grid grid-cols-2 gap-3">
        <NumberInput name="hours" label="Hours" />
        <NumberInput name="quality" label="Quality" />
      </div>
    );
  }

  if (type === "body") {
    return (
      <div className="grid grid-cols-2 gap-3">
        <NumberInput name="weight" label="Weight" />
        <NumberInput name="waist" label="Waist" />
      </div>
    );
  }

  if (type === "focus" || type === "business") {
    return (
      <>
        <Field label="Title">
          <TextInput
            name="title"
            placeholder={type === "business" ? "MVP block" : "Deep work"}
          />
        </Field>
        <div className="grid grid-cols-2 gap-3">
          <NumberInput name="duration" label="Minutes" />
          {type === "focus" ? (
            <NumberInput name="quality" label="Quality" />
          ) : (
            <Field label="Category">
              <TextInput name="category" placeholder="Build" />
            </Field>
          )}
        </div>
        {type === "focus" ? (
          <Field label="Project">
            <TextInput name="project" placeholder="Business" />
          </Field>
        ) : null}
      </>
    );
  }

  if (type === "transaction") {
    return (
      <>
        <div className="grid grid-cols-2 gap-3">
          <NumberInput name="amount" label="Amount" />
          <Field label="Currency">
            <TextInput name="currency" defaultValue="EUR" />
          </Field>
        </div>
        <Field label="Category">
          <TextInput name="category" placeholder="Food" />
        </Field>
      </>
    );
  }

  return (
    <>
      <div className="grid grid-cols-2 gap-3">
        <Field label="Symbol">
          <TextInput name="symbol" placeholder="VWCE" />
        </Field>
        <Field label="Currency">
          <TextInput name="currency" defaultValue="USD" />
        </Field>
        <NumberInput name="quantity" label="Quantity" />
        <NumberInput name="averageBuyPrice" label="Avg buy" />
        <NumberInput name="currentPrice" label="Price" />
      </div>
      <Field label="Name">
        <TextInput name="title" placeholder="Asset name" />
      </Field>
    </>
  );
}

function NumberInput({ name, label }: { name: string; label: string }) {
  return (
    <Field label={label}>
      <TextInput name={name} type="number" inputMode="decimal" step="0.1" />
    </Field>
  );
}

function number(value: FormDataEntryValue | null) {
  if (typeof value !== "string" || value.trim() === "") return null;
  return Number(value);
}

function text(value: FormDataEntryValue | null) {
  if (typeof value !== "string" || value.trim() === "") return null;
  return value.trim();
}
