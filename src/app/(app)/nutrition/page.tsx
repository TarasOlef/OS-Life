"use client";

import { useState, type FormEvent } from "react";
import { Camera, Flame, Soup, Trash2, Utensils } from "lucide-react";
import { z } from "zod";
import { AddEntryDialog } from "@/components/app/add-entry-dialog";
import { DashboardCard } from "@/components/app/dashboard-card";
import { EmptyState } from "@/components/app/empty-state";
import { MetricCard } from "@/components/app/metric-card";
import { PageHeader } from "@/components/app/page-header";
import { Button } from "@/components/ui/button";
import { Field, TextArea, TextInput } from "@/components/forms/form-controls";
import { useNutrition } from "@/features/nutrition/use-nutrition";
import { lastNDays, todayIso } from "@/lib/data/dates";
import { sum } from "@/lib/data/format";
import { DemoChart } from "@/components/app/demo-chart";

const mealFormSchema = z.object({
  mealName: z.string().trim().nullable(),
  calories: z.coerce.number().finite().nonnegative().nullable(),
  proteinG: z.coerce.number().finite().nonnegative().nullable(),
  carbsG: z.coerce.number().finite().nonnegative().nullable(),
  fatG: z.coerce.number().finite().nonnegative().nullable(),
  notes: z.string().trim().nullable(),
});

export default function NutritionPage() {
  const nutrition = useNutrition();
  const [error, setError] = useState<string | null>(null);
  const today = todayIso();
  const todaysMeals = nutrition.items.filter((item) => item.date === today);
  const calories = sum(todaysMeals.map((item) => item.calories));
  const protein = sum(todaysMeals.map((item) => item.proteinG));
  const weeklyData = lastNDays(7).map((date) => ({
    day: new Date(`${date}T00:00:00`).toLocaleDateString("en-US", {
      weekday: "short",
    }),
    score: sum(
      nutrition.items
        .filter((item) => item.date === date)
        .map((item) => item.calories),
    ),
  }));

  async function handleSubmit(
    event: FormEvent<HTMLFormElement>,
    close: () => void,
  ) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const parsed = mealFormSchema.safeParse({
      mealName: nullableText(formData.get("mealName")),
      calories: nullableNumber(formData.get("calories")),
      proteinG: nullableNumber(formData.get("proteinG")),
      carbsG: nullableNumber(formData.get("carbsG")),
      fatG: nullableNumber(formData.get("fatG")),
      notes: nullableText(formData.get("notes")),
    });

    if (!parsed.success) {
      setError("Check the meal fields and try again.");
      return;
    }

    await nutrition.create({
      date: today,
      imageUrl: null,
      aiEstimated: false,
      ...parsed.data,
    });
    setError(null);
    close();
  }

  return (
    <>
      <PageHeader
        eyebrow="Nutrition"
        title="Manual meals now. AI later."
        description="Track calories and macros locally in this browser. Image analysis is intentionally deferred."
        actions={
          <AddEntryDialog
            title="Add meal"
            description="Manual logging keeps the first sprint useful without external APIs."
            triggerLabel="Add meal"
          >
            {(close) => (
              <form
                className="grid gap-4"
                onSubmit={(event) => handleSubmit(event, close)}
              >
                <Field label="Meal name">
                  <TextInput name="mealName" placeholder="Chicken rice bowl" />
                </Field>
                <div className="grid gap-4 sm:grid-cols-2">
                  <Field label="Calories">
                    <TextInput name="calories" type="number" min="0" step="1" />
                  </Field>
                  <Field label="Protein">
                    <TextInput
                      name="proteinG"
                      type="number"
                      min="0"
                      step="0.1"
                    />
                  </Field>
                  <Field label="Carbs">
                    <TextInput name="carbsG" type="number" min="0" step="0.1" />
                  </Field>
                  <Field label="Fat">
                    <TextInput name="fatG" type="number" min="0" step="0.1" />
                  </Field>
                </div>
                <Field label="Notes">
                  <TextArea name="notes" placeholder="Optional notes" />
                </Field>
                {error ? (
                  <p className="text-sm text-destructive">{error}</p>
                ) : null}
                <Button type="submit">Save meal</Button>
              </form>
            )}
          </AddEntryDialog>
        }
      />

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        <MetricCard
          title="Calories"
          value={calories > 0 ? `${calories} kcal` : "Not logged"}
          description="Today total."
          icon={Flame}
        />
        <MetricCard
          title="Protein"
          value={protein > 0 ? `${protein} g` : "Not logged"}
          description="Today total."
          icon={Soup}
        />
        <MetricCard
          title="Meals"
          value={String(todaysMeals.length)}
          description="Meals recorded today."
          icon={Utensils}
        />
      </section>

      <section className="grid gap-4 lg:grid-cols-2">
        <DashboardCard title="Today's meals">
          {todaysMeals.length > 0 ? (
            <div className="space-y-3">
              {todaysMeals.map((meal) => (
                <div
                  key={meal.id}
                  className="flex items-start justify-between gap-3 rounded-md border border-border bg-secondary/30 p-3"
                >
                  <div>
                    <p className="font-medium">{meal.mealName ?? "Meal"}</p>
                    <p className="text-sm text-muted-foreground">
                      {meal.calories ?? 0} kcal | {meal.proteinG ?? 0} g protein
                    </p>
                    {meal.notes ? (
                      <p className="mt-1 text-sm text-muted-foreground">
                        {meal.notes}
                      </p>
                    ) : null}
                  </div>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={() => void nutrition.remove(meal.id)}
                    aria-label="Delete meal"
                  >
                    <Trash2 className="size-4" aria-hidden="true" />
                  </Button>
                </div>
              ))}
            </div>
          ) : (
            <EmptyState
              title="No meals today"
              description="Add a manual meal to start building today's nutrition totals."
              icon={Utensils}
            />
          )}
        </DashboardCard>

        <DashboardCard title="Weekly calories">
          {weeklyData.some((point) => point.score > 0) ? (
            <DemoChart data={weeklyData} />
          ) : (
            <EmptyState
              title="No weekly nutrition data"
              description="The chart will appear after meals are logged."
              icon={Flame}
            />
          )}
        </DashboardCard>
      </section>

      <DashboardCard
        title="AI food image analysis"
        description="Disabled placeholder. No OpenAI request is made."
      >
        <div className="flex min-h-52 flex-col items-center justify-center rounded-lg border border-dashed border-border bg-secondary/30 p-6 text-center">
          <Camera className="size-8 text-muted-foreground" aria-hidden="true" />
          <p className="mt-4 max-w-md text-sm leading-6 text-muted-foreground">
            AI food image analysis will be added server-side in a later sprint.
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
