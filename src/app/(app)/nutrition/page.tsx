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
import { getNutritionSummary } from "@/features/nutrition/calculations";
import { useNutrition } from "@/features/nutrition/use-nutrition";
import { todayIso } from "@/lib/data/dates";
import { DemoChart } from "@/components/app/demo-chart";

const mealFormSchema = z.object({
  date: z.string().min(1),
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
  const summary = getNutritionSummary(nutrition.items, today);

  async function handleSubmit(
    event: FormEvent<HTMLFormElement>,
    close: () => void,
  ) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const parsed = mealFormSchema.safeParse({
      date: String(formData.get("date") || today),
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
                  <Field label="Date">
                    <TextInput name="date" type="date" defaultValue={today} />
                  </Field>
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
          value={
            summary.totals.calories > 0
              ? `${summary.totals.calories} kcal`
              : "Not logged"
          }
          description="Today total."
          icon={Flame}
        />
        <MetricCard
          title="Protein"
          value={
            summary.totals.protein > 0
              ? `${summary.totals.protein} g`
              : "Not logged"
          }
          description="Today total."
          icon={Soup}
        />
        <MetricCard
          title="Meals"
          value={String(summary.meals.length)}
          description="Meals recorded today."
          icon={Utensils}
        />
        <MetricCard
          title="Carbs"
          value={
            summary.totals.carbs > 0
              ? `${summary.totals.carbs} g`
              : "Not logged"
          }
          description="Today total."
          icon={Utensils}
        />
        <MetricCard
          title="Fat"
          value={
            summary.totals.fat > 0 ? `${summary.totals.fat} g` : "Not logged"
          }
          description="Today total."
          icon={Utensils}
        />
      </section>

      <section className="grid gap-4 lg:grid-cols-2">
        <DashboardCard title="Today's meals">
          {summary.meals.length > 0 ? (
            <div className="space-y-3">
              {summary.meals.map((meal) => (
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
          {summary.weeklyCalories.some((point) => point.score > 0) ? (
            <DemoChart data={summary.weeklyCalories} />
          ) : (
            <EmptyState
              title="No weekly nutrition data"
              description="The chart will appear after meals are logged."
              icon={Flame}
            />
          )}
        </DashboardCard>
      </section>

      <section className="grid gap-4 lg:grid-cols-2">
        <DashboardCard title="Weekly protein">
          {summary.weeklyProtein.some((point) => point.score > 0) ? (
            <DemoChart data={summary.weeklyProtein} />
          ) : (
            <EmptyState
              title="No protein trend yet"
              description="Protein trend appears after meals are logged."
              icon={Soup}
            />
          )}
        </DashboardCard>
        <DashboardCard
          title="Macro summary"
          description="Today totals from locally logged meals."
        >
          <div className="grid gap-2 text-sm">
            <div className="flex justify-between rounded-md bg-secondary/30 px-3 py-2">
              <span>Protein</span>
              <span>{summary.totals.protein} g</span>
            </div>
            <div className="flex justify-between rounded-md bg-secondary/30 px-3 py-2">
              <span>Carbs</span>
              <span>{summary.totals.carbs} g</span>
            </div>
            <div className="flex justify-between rounded-md bg-secondary/30 px-3 py-2">
              <span>Fat</span>
              <span>{summary.totals.fat} g</span>
            </div>
          </div>
        </DashboardCard>
      </section>

      <DashboardCard title="Recent meals">
        {summary.recentMeals.length > 0 ? (
          <div className="space-y-3">
            {summary.recentMeals.map((meal) => (
              <div
                key={meal.id}
                className="flex items-start justify-between gap-3 rounded-md border border-border bg-secondary/30 p-3"
              >
                <div>
                  <p className="font-medium">{meal.mealName ?? "Meal"}</p>
                  <p className="text-sm text-muted-foreground">
                    {meal.date} | {meal.calories ?? 0} kcal |{" "}
                    {meal.proteinG ?? 0} g protein
                  </p>
                </div>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  onClick={() => void nutrition.remove(meal.id)}
                  aria-label="Delete recent meal"
                >
                  <Trash2 className="size-4" aria-hidden="true" />
                </Button>
              </div>
            ))}
          </div>
        ) : (
          <EmptyState
            title="No recent meals"
            description="Meals from any date will appear here."
            icon={Utensils}
          />
        )}
      </DashboardCard>

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
