import { ArrowDownRight, ArrowRight, ArrowUpRight } from "lucide-react";
import { cn } from "@/lib/utils";

type StatTrendProps = {
  label: string;
  value: string;
  direction?: "up" | "down" | "flat";
};

export function StatTrend({
  label,
  value,
  direction = "flat",
}: StatTrendProps) {
  const Icon =
    direction === "up"
      ? ArrowUpRight
      : direction === "down"
        ? ArrowDownRight
        : ArrowRight;

  return (
    <div className="flex items-center justify-between rounded-md border border-border bg-secondary/30 px-3 py-2">
      <span className="text-sm text-muted-foreground">{label}</span>
      <span
        className={cn(
          "inline-flex items-center gap-1 text-sm font-medium",
          direction === "up" && "text-emerald-300",
          direction === "down" && "text-amber-300",
          direction === "flat" && "text-foreground",
        )}
      >
        {value}
        <Icon className="size-4" aria-hidden="true" />
      </span>
    </div>
  );
}
