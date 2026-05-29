import type { FinanceTransaction } from "@/lib/data/schemas";
import { isThisMonth, lastNDays, todayIso } from "@/lib/data/dates";
import { sum } from "@/lib/data/format";

export function getFinanceSummary(
  transactions: FinanceTransaction[],
  date = todayIso(),
) {
  const monthTransactions = transactions.filter((transaction) =>
    isThisMonth(transaction.date),
  );
  const categoryTotals = groupByCategory(monthTransactions);
  const daysElapsed = new Date().getDate();

  return {
    spentToday: sum(
      transactions
        .filter((transaction) => transaction.date === date)
        .map((transaction) => transaction.amount),
    ),
    spentThisMonth: sum(
      monthTransactions.map((transaction) => transaction.amount),
    ),
    biggestCategory: categoryTotals[0] ?? null,
    averageDailySpend:
      sum(monthTransactions.map((transaction) => transaction.amount)) /
      daysElapsed,
    categoryTotals,
    weeklySpend: lastNDays(7).map((day) => ({
      day: new Date(`${day}T00:00:00`).toLocaleDateString("en-US", {
        weekday: "short",
      }),
      score: sum(
        transactions
          .filter((transaction) => transaction.date === day)
          .map((transaction) => transaction.amount),
      ),
    })),
  };
}

export function groupByCategory(items: FinanceTransaction[]) {
  const totals = new Map<string, number>();
  for (const item of items) {
    totals.set(item.category, (totals.get(item.category) ?? 0) + item.amount);
  }
  return Array.from(totals, ([category, total]) => ({ category, total })).sort(
    (a, b) => b.total - a.total,
  );
}
