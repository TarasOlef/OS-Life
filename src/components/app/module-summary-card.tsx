import type { LucideIcon } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

type ModuleSummaryCardProps = {
  title: string;
  value: string;
  description: string;
  icon: LucideIcon;
};

export function ModuleSummaryCard({
  title,
  value,
  description,
  icon: Icon,
}: ModuleSummaryCardProps) {
  return (
    <Card>
      <CardContent className="flex gap-4 p-5">
        <div className="flex size-11 shrink-0 items-center justify-center rounded-lg border border-border bg-secondary/50">
          <Icon className="size-5 text-muted-foreground" aria-hidden="true" />
        </div>
        <div>
          <p className="text-sm font-medium text-muted-foreground">{title}</p>
          <p className="mt-1 text-2xl font-semibold text-foreground">{value}</p>
          <p className="mt-1 text-sm leading-5 text-muted-foreground">
            {description}
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
