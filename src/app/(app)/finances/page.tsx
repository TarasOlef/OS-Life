"use client";

import { type FormEvent } from "react";
import { Banknote, CreditCard, ReceiptText, Tags, Trash2 } from "lucide-react";
import { AddEntryDialog } from "@/components/app/add-entry-dialog";
import { DashboardCard } from "@/components/app/dashboard-card";
import { DemoChart } from "@/components/app/demo-chart";
import { EmptyState } from "@/components/app/empty-state";
import { MetricCard } from "@/components/app/metric-card";
import { PageHeader } from "@/components/app/page-header";
import { SimpleBarChart } from "@/components/app/simple-bar-chart";
import { Button } from "@/components/ui/button";
import {
  Field,
  SelectInput,
  TextInput,
} from "@/components/forms/form-controls";
import { getFinanceSummary } from "@/features/finances/calculations";
import { useFinances } from "@/features/finances/use-finances";
import { useProgress } from "@/features/progress/use-progress";
import { todayIso } from "@/lib/data/dates";
import { currency } from "@/lib/data/format";

export default function FinancesPage() {
  const finances = useFinances();
  const progress = useProgress();
  const summary = getFinanceSummary(finances.items);
  const spendLimit = progress.targets?.money.monthlySpendingLimit ?? null;

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
        title="Finances"
        description="Spend"
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
          title="Spent today"
          value={currency(summary.spentToday)}
          description="Positive expense amounts."
          icon={CreditCard}
        />
        <MetricCard
          title="Monthly spend"
          value={currency(summary.spentThisMonth)}
          description={
            spendLimit ? `Limit ${currency(spendLimit)}` : "Current month."
          }
          icon={CreditCard}
        />
        <MetricCard
          title="Biggest category"
          value={summary.biggestCategory?.category ?? "Pending"}
          description={
            summary.biggestCategory
              ? currency(summary.biggestCategory.total)
              : "No transactions yet."
          }
          icon={Tags}
        />
        <MetricCard
          title="Avg daily spend"
          value={currency(summary.averageDailySpend)}
          description="Average this month."
          icon={Banknote}
        />
      </section>

      <section className="grid gap-4 lg:grid-cols-2">
        <DashboardCard title="Weekly spend">
          {summary.weeklySpend.some((point) => point.score > 0) ? (
            <DemoChart data={summary.weeklySpend} />
          ) : (
            <EmptyState
              title="No spend chart yet"
              description="Add transactions to build weekly spend."
              icon={CreditCard}
            />
          )}
        </DashboardCard>
        <DashboardCard title="Spend by category">
          {summary.categoryTotals.length > 0 ? (
            <SimpleBarChart
              data={summary.categoryTotals.map((item) => ({
                label: item.category,
                value: item.total,
              }))}
            />
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

function nullableText(value: FormDataEntryValue | null) {
  if (typeof value !== "string" || value.trim() === "") return null;
  return value.trim();
}
