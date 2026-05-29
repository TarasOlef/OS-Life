"use client";

import { type FormEvent } from "react";
import { Banknote, CreditCard, ReceiptText, Tags, Trash2 } from "lucide-react";
import { AddEntryDialog } from "@/components/app/add-entry-dialog";
import { DashboardCard } from "@/components/app/dashboard-card";
import { DemoChart } from "@/components/app/demo-chart";
import { EmptyState } from "@/components/app/empty-state";
import { MetricCard } from "@/components/app/metric-card";
import { PageHeader } from "@/components/app/page-header";
import { Button } from "@/components/ui/button";
import {
  Field,
  SelectInput,
  TextInput,
} from "@/components/forms/form-controls";
import { useFinances } from "@/features/finances/use-finances";
import { isThisMonth, lastNDays, todayIso } from "@/lib/data/dates";
import { currency, sum } from "@/lib/data/format";

export default function FinancesPage() {
  const finances = useFinances();
  const monthlySpend = sum(
    finances.items
      .filter((item) => isThisMonth(item.date))
      .map((item) => item.amount),
  );
  const categories = groupByCategory(finances.items);
  const chartData = lastNDays(7).map((date) => ({
    day: new Date(`${date}T00:00:00`).toLocaleDateString("en-US", {
      weekday: "short",
    }),
    score: sum(
      finances.items
        .filter((item) => item.date === date)
        .map((item) => item.amount),
    ),
  }));

  async function handleSubmit(
    event: FormEvent<HTMLFormElement>,
    close: () => void,
  ) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    await finances.create({
      date: String(formData.get("date") || todayIso()),
      amount: Number(formData.get("amount") || 0),
      currency: String(formData.get("currency") || "EUR"),
      category: String(formData.get("category") || "General"),
      description: nullableText(formData.get("description")),
    });
    close();
  }

  return (
    <>
      <PageHeader
        eyebrow="Finances"
        title="Personal spending."
        description="Manual local transaction tracking before any external finance integrations."
        actions={
          <AddEntryDialog
            title="Add transaction"
            triggerLabel="Add transaction"
          >
            {(close) => (
              <form
                className="grid gap-4"
                onSubmit={(event) => handleSubmit(event, close)}
              >
                <div className="grid gap-4 sm:grid-cols-2">
                  <Field label="Amount">
                    <TextInput
                      name="amount"
                      type="number"
                      min="0"
                      step="0.01"
                      required
                    />
                  </Field>
                  <Field label="Category">
                    <TextInput name="category" placeholder="Food" required />
                  </Field>
                  <Field label="Date">
                    <TextInput
                      name="date"
                      type="date"
                      defaultValue={todayIso()}
                    />
                  </Field>
                  <Field label="Currency">
                    <SelectInput name="currency" defaultValue="EUR">
                      <option>EUR</option>
                      <option>USD</option>
                    </SelectInput>
                  </Field>
                  <Field label="Description">
                    <TextInput name="description" placeholder="Optional" />
                  </Field>
                </div>
                <Button type="submit">Save transaction</Button>
              </form>
            )}
          </AddEntryDialog>
        }
      />

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <MetricCard
          title="Monthly spend"
          value={currency(monthlySpend)}
          description="Current month."
          icon={CreditCard}
        />
        <MetricCard
          title="Income"
          value="Placeholder"
          description="Income tracking comes later."
          icon={Banknote}
        />
        <MetricCard
          title="Savings"
          value="Placeholder"
          description="Manual savings signal planned."
          icon={Banknote}
        />
        <MetricCard
          title="Categories"
          value={String(categories.length)}
          description="Active spend groups."
          icon={Tags}
        />
      </section>

      <section className="grid gap-4 lg:grid-cols-2">
        <DashboardCard title="Weekly spend">
          {chartData.some((point) => point.score > 0) ? (
            <DemoChart data={chartData} />
          ) : (
            <EmptyState
              title="No spend chart yet"
              description="Add transactions to build weekly spend."
              icon={CreditCard}
            />
          )}
        </DashboardCard>
        <DashboardCard title="Spend by category">
          {categories.length > 0 ? (
            <div className="space-y-2">
              {categories.map((item) => (
                <div
                  key={item.category}
                  className="flex justify-between rounded-md border border-border bg-secondary/30 px-3 py-2 text-sm"
                >
                  <span>{item.category}</span>
                  <span>{currency(item.total)}</span>
                </div>
              ))}
            </div>
          ) : (
            <EmptyState
              title="No categories yet"
              description="Categories appear after transactions are logged."
              icon={Tags}
            />
          )}
        </DashboardCard>
      </section>

      <DashboardCard title="Recent transactions">
        {finances.items.length > 0 ? (
          <div className="space-y-3">
            {finances.items.map((transaction) => (
              <div
                key={transaction.id}
                className="flex justify-between gap-3 rounded-md border border-border bg-secondary/30 p-3"
              >
                <div>
                  <p className="font-medium">{transaction.category}</p>
                  <p className="text-sm text-muted-foreground">
                    {transaction.date} |{" "}
                    {transaction.description ?? "No description"}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium">
                    {currency(transaction.amount, transaction.currency)}
                  </span>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={() => void finances.remove(transaction.id)}
                    aria-label="Delete transaction"
                  >
                    <Trash2 className="size-4" aria-hidden="true" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <EmptyState
            title="No recent transactions"
            description="Add a manual transaction to start tracking spending."
            icon={ReceiptText}
          />
        )}
      </DashboardCard>
    </>
  );
}

function groupByCategory(items: { category: string; amount: number }[]) {
  const totals = new Map<string, number>();
  for (const item of items)
    totals.set(item.category, (totals.get(item.category) ?? 0) + item.amount);
  return Array.from(totals, ([category, total]) => ({ category, total }));
}

function nullableText(value: FormDataEntryValue | null) {
  if (typeof value !== "string" || value.trim() === "") return null;
  return value.trim();
}
