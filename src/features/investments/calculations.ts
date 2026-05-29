import type { InvestmentPosition } from "@/lib/data/schemas";
import { sum } from "@/lib/data/format";

export function getInvestmentSummary(positions: InvestmentPosition[]) {
  const portfolioValue = sum(
    positions.map(
      (position) => (position.currentPrice ?? 0) * position.quantity,
    ),
  );
  const totalInvested = sum(
    positions.map(
      (position) => (position.averageBuyPrice ?? 0) * position.quantity,
    ),
  );
  const gainLoss = portfolioValue - totalInvested;
  const gainLossPercent =
    totalInvested > 0 ? (gainLoss / totalInvested) * 100 : 0;

  return {
    portfolioValue,
    totalInvested,
    gainLoss,
    gainLossPercent,
    allocation: positions.map((position) => ({
      label: position.symbol,
      value: (position.currentPrice ?? 0) * position.quantity,
    })),
  };
}
