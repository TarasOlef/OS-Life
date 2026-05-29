import type { LucideIcon } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

type MetricCardProps = {
  title: string;
  value: string;
  description?: string;
  icon?: LucideIcon;
  status?: "idle" | "good" | "warning";
};

const statusClassNames: Record<
  NonNullable<MetricCardProps["status"]>,
  string
> = {
  idle: "text-muted-foreground",
  good: "text-emerald-300",
  warning: "text-amber-300",
};

export function MetricCard({
  title,
  value,
  description,
  icon: Icon,
  status = "idle",
}: MetricCardProps) {
  return (
    <Card className="min-h-32">
      <CardContent className="flex h-full flex-col justify-between gap-4 p-5">
        <div className="flex items-start justify-between gap-3">
          <p className="text-sm font-medium text-muted-foreground">{title}</p>
          {Icon ? (
            <Icon
              className={cn("size-4 shrink-0", statusClassNames[status])}
              aria-hidden="true"
            />
          ) : null}
        </div>
        <div>
          <p className="text-2xl font-semibold tracking-normal text-foreground">
            {value}
          </p>
          {description ? (
            <p className="mt-1 text-sm leading-5 text-muted-foreground">
              {description}
            </p>
          ) : null}
        </div>
      </CardContent>
    </Card>
  );
}
