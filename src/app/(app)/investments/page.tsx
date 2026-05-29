"use client";

import { type FormEvent } from "react";
import { LineChart, Plus, ServerCog, Trash2, WalletCards } from "lucide-react";
import { AddEntryDialog } from "@/components/app/add-entry-dialog";
import { DashboardCard } from "@/components/app/dashboard-card";
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
import { getInvestmentSummary } from "@/features/investments/calculations";
import { useInvestments } from "@/features/investments/use-investments";
import { currency } from "@/lib/data/format";

export default function InvestmentsPage() {
  const investments = useInvestments();
  const summary = getInvestmentSummary(investments.items);

  async function handleSubmit(
    event: FormEvent<HTMLFormElement>,
    close: () => void,
  ) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    await investments.create({
      symbol: String(formData.get("symbol") || "").toUpperCase(),
      assetName: nullableText(formData.get("assetName")),
      quantity: Number(formData.get("quantity") || 0),
      averageBuyPrice: nullableNumber(formData.get("averageBuyPrice")),
      currentPrice: nullableNumber(formData.get("currentPrice")),
      currency: String(formData.get("currency") || "USD"),
    });
    close();
  }

  return (
    <>
      <PageHeader
        eyebrow="Investments"
        title="Manual portfolio tracker."
        description="Track positions with manual current prices before live market data exists."
        actions={
          <AddEntryDialog title="Add position" triggerLabel="Add position">
            {(close) => (
              <form
                className="grid gap-4"
                onSubmit={(event) => handleSubmit(event, close)}
              >
                <div className="grid gap-4 sm:grid-cols-2">
                  <Field label="Symbol">
                    <TextInput name="symbol" placeholder="AAPL" required />
                  </Field>
                  <Field label="Asset name">
                    <TextInput name="assetName" placeholder="Apple" />
                  </Field>
                  <Field label="Quantity">
                    <TextInput
                      name="quantity"
                      type="number"
                      min="0"
                      step="0.0001"
                      required
                    />
                  </Field>
                  <Field label="Average buy price">
                    <TextInput
                      name="averageBuyPrice"
                      type="number"
                      min="0"
                      step="0.01"
                    />
                  </Field>
                  <Field label="Current price">
                    <TextInput
                      name="currentPrice"
                      type="number"
                      min="0"
                      step="0.01"
                    />
                  </Field>
                  <Field label="Currency">
                    <SelectInput name="currency" defaultValue="USD">
                      <option>USD</option>
                      <option>EUR</option>
                    </SelectInput>
                  </Field>
                </div>
                <Button type="submit">
                  <Plus className="size-4" aria-hidden="true" />
                  Save position
                </Button>
              </form>
            )}
          </AddEntryDialog>
        }
      />

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        <MetricCard
          title="Portfolio value"
          value={currency(summary.portfolioValue, "USD")}
          description="Manual current prices."
          icon={WalletCards}
        />
        <MetricCard
          title="Total invested"
          value={currency(summary.totalInvested, "USD")}
          description="Average buy price x quantity."
          icon={LineChart}
        />
        <MetricCard
          title="Estimated gain/loss"
          value={currency(summary.gainLoss, "USD")}
          description={`${summary.gainLossPercent.toFixed(1)}% based on manual prices.`}
          icon={ServerCog}
          status={summary.gainLoss >= 0 ? "good" : "warning"}
        />
      </section>

      <DashboardCard title="Allocation by position">
        {summary.allocation.some((point) => point.value > 0) ? (
          <SimpleBarChart data={summary.allocation} />
        ) : (
          <EmptyState
            title="No allocation yet"
            description="Add positions with current prices to see allocation."
            icon={LineChart}
          />
        )}
      </DashboardCard>

      <DashboardCard title="Positions">
        {investments.items.length > 0 ? (
          <div className="space-y-3">
            {investments.items.map((position) => {
              const value = (position.currentPrice ?? 0) * position.quantity;
              return (
                <div
                  key={position.id}
                  className="flex justify-between gap-3 rounded-md border border-border bg-secondary/30 p-3"
                >
                  <div>
                    <p className="font-medium">{position.symbol}</p>
                    <p className="text-sm text-muted-foreground">
                      {position.assetName ?? "Unnamed asset"} |{" "}
                      {position.quantity} shares
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium">
                      {currency(value, position.currency)}
                    </span>
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      onClick={() => void investments.remove(position.id)}
                      aria-label="Delete position"
                    >
                      <Trash2 className="size-4" aria-hidden="true" />
                    </Button>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <EmptyState
            title="No positions yet"
            description="Add a symbol and manual prices to calculate portfolio value."
            icon={LineChart}
          />
        )}
      </DashboardCard>

      <DashboardCard title="Market data note">
        <p className="text-sm leading-6 text-muted-foreground">
          Live prices will be added later through a server-side market data API.
        </p>
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
