import * as React from "react";
import { cn } from "@/lib/utils";

type BadgeProps = React.HTMLAttributes<HTMLDivElement> & {
  tone?: "neutral" | "success" | "warning" | "info";
};

const toneClassNames: Record<NonNullable<BadgeProps["tone"]>, string> = {
  neutral: "border-border bg-secondary text-secondary-foreground",
  success:
    "border-emerald-500/30 bg-emerald-500/10 text-emerald-300 dark:text-emerald-300",
  warning:
    "border-amber-500/30 bg-amber-500/10 text-amber-700 dark:text-amber-300",
  info: "border-sky-500/30 bg-sky-500/10 text-sky-700 dark:text-sky-300",
};

export function Badge({ className, tone = "neutral", ...props }: BadgeProps) {
  return (
    <div
      className={cn(
        "inline-flex w-fit items-center rounded-md border px-2.5 py-1 text-xs font-medium",
        toneClassNames[tone],
        className,
      )}
      {...props}
    />
  );
}
