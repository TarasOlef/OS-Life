"use client";

import { useState, type FormEvent } from "react";
import { Camera, Plus, Soup, Sparkles, Trash2, Utensils } from "lucide-react";
import { z } from "zod";
import { AddEntryDialog } from "@/components/app/add-entry-dialog";
import { AnimatedCard } from "@/components/app/animated";
import { DashboardCard } from "@/components/app/dashboard-card";
import { EmptyState } from "@/components/app/empty-state";
import { FloatingActionButton } from "@/components/app/floating-action-button";
import { PageHeader } from "@/components/app/page-header";
import { ProgressRing } from "@/components/app/progress-ring";
import { Button } from "@/components/ui/button";
import { Field, TextArea, TextInput } from "@/components/forms/form-controls";
import { getNutritionSummary } from "@/features/nutrition/calculations";
import { MacroPill } from "@/features/nutrition/components/macro-pill";
import { MealCard } from "@/features/nutrition/components/meal-card";
import { WeekStrip } from "@/features/nutrition/components/week-strip";
import { useNutrition } from "@/features/nutrition/use-nutrition";
import { lastNDays, todayIso } from "@/lib/data/dates";
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
  const [selectedDate, setSelectedDate] = useState(today);
  const summary = getNutritionSummary(nutrition.items, selectedDate);
  const weekDays = lastNDays(7);
  const calorieTarget = 2300;
  const proteinTarget = 160;
  const calorieProgress = Math.min(
    100,
    Math.round((summary.totals.calories / calorieTarget) * 100),
  );
  const proteinProgress = Math.min(
    100,
    Math.round((summary.totals.protein / proteinTarget) * 100),
  );

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
        eyebrow="Today"
        title="Nutrition"
        actions={
          <AddEntryDialog
            title="Add meal"
            triggerLabel="Add meal"
            trigger={(open) => (
              <>
                <Button
                  type="button"
                  onClick={open}
                  className="hidden xl:inline-flex"
                >
                  <Plus className="size-4" aria-hidden="true" />
                  Add meal
                </Button>
                <FloatingActionButton label="Add meal" onClick={open} />
              </>
            )}
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
                    <TextInput
                      name="date"
                      type="date"
                      defaultValue={selectedDate}
                    />
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
                  <TextArea name="notes" placeholder="Optional" />
                </Field>
                {error ? (
                  <p className="text-sm text-destructive">{error}</p>
                ) : null}
                <div className="grid grid-cols-2 gap-3">
                  <Button type="button" variant="secondary" onClick={close}>
                    Cancel
                  </Button>
                  <Button type="submit">Save</Button>
                </div>
              </form>
            )}
          </AddEntryDialog>
        }
      />

      <WeekStrip
        days={weekDays}
        selectedDate={selectedDate}
        entries={nutrition.items}
        onSelect={setSelectedDate}
      />

      <section className="grid gap-4 lg:grid-cols-2">
        <AnimatedCard>
          <div className="rounded-[2rem] bg-card p-6 shadow-[0_18px_55px_rgb(0_0_0/0.06)] dark:border dark:border-border/60 dark:shadow-none">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-sm font-semibold text-muted-foreground">
                  Calories
                </p>
                <p className="mt-2 text-4xl font-semibold tracking-tight">
                  {summary.totals.calories.toLocaleString()}
                  <span className="text-xl text-muted-foreground">
                    {" "}
                    / {calorieTarget.toLocaleString()}
                  </span>
                </p>
              </div>
              <ProgressRing
                value={calorieProgress}
                size={96}
                stroke={10}
                label={`${calorieProgress}%`}
              />
            </div>
          </div>
        </AnimatedCard>

        <AnimatedCard delay={60}>
          <div className="rounded-[2rem] bg-card p-6 shadow-[0_18px_55px_rgb(0_0_0/0.06)] dark:border dark:border-border/60 dark:shadow-none">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-sm font-semibold text-muted-foreground">
                  Protein
                </p>
                <p className="mt-2 text-4xl font-semibold tracking-tight">
                  {summary.totals.protein}g
                </p>
              </div>
              <ProgressRing value={proteinProgress} size={78} stroke={9} />
            </div>
            <div className="mt-5 flex flex-wrap gap-2">
              <MacroPill label="P" value={summary.totals.protein} />
              <MacroPill label="C" value={summary.totals.carbs} />
              <MacroPill label="F" value={summary.totals.fat} />
            </div>
          </div>
        </AnimatedCard>
      </section>

      <div className="rounded-[1.5rem] border border-border/60 bg-card p-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-semibold">Protein</p>
            <p className="text-2xl font-semibold">{summary.totals.protein}g</p>
          </div>
          <div className="text-right text-xs font-semibold text-muted-foreground">
            {proteinTarget}g target
          </div>
        </div>
      </div>

      <section className="grid gap-4 xl:grid-cols-[1.1fr_0.9fr]">
        <DashboardCard title="Recent">
          {summary.meals.length > 0 ? (
            <div className="space-y-3">
              {summary.meals.map((meal) => (
                <MealCard
                  key={meal.id}
                  meal={meal}
                  onDelete={() => void nutrition.remove(meal.id)}
                />
              ))}
            </div>
          ) : (
            <EmptyState
              title="No meals"
              description="Log your first meal."
              icon={Utensils}
            />
          )}
        </DashboardCard>

        <DashboardCard title="Trend">
          {summary.weeklyCalories.some((point) => point.score > 0) ? (
            <DemoChart data={summary.weeklyCalories} />
          ) : (
            <EmptyState
              title="No trend"
              description="Log meals."
              icon={Utensils}
            />
          )}
        </DashboardCard>
      </section>

      <section className="grid gap-4 lg:grid-cols-2">
        <DashboardCard title="Protein trend">
          {summary.weeklyProtein.some((point) => point.score > 0) ? (
            <DemoChart data={summary.weeklyProtein} />
          ) : (
            <EmptyState
              title="No trend"
              description="Log protein."
              icon={Soup}
            />
          )}
        </DashboardCard>
        <DashboardCard title="AI scan">
          <div className="flex items-center justify-between rounded-[1.35rem] bg-secondary/40 p-4">
            <div className="flex items-center gap-3">
              <div className="flex size-12 items-center justify-center rounded-full bg-card">
                <Camera className="size-5 text-muted-foreground" />
              </div>
              <div>
                <p className="font-semibold">Photo - macros</p>
                <p className="text-xs font-semibold text-muted-foreground">
                  Soon
                </p>
              </div>
            </div>
            <Sparkles className="size-5 text-muted-foreground" />
          </div>
        </DashboardCard>
      </section>
      <DashboardCard title="All meals">
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
