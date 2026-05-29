import type { LucideIcon } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

type CompactStatCardProps = {
  label: string;
  value: string;
  meta?: string;
  icon?: LucideIcon;
};

export function CompactStatCard({
  label,
  value,
  meta,
  icon: Icon,
}: CompactStatCardProps) {
  return (
    <Card>
      <CardContent className="p-4">
        <div className="flex items-start justify-between gap-2">
          <p className="text-[0.7rem] font-semibold uppercase tracking-[0.12em] text-muted-foreground">
            {label}
          </p>
          {Icon ? <Icon className="size-4 text-muted-foreground" /> : null}
        </div>
        <p className="mt-3 text-2xl font-semibold tracking-tight text-foreground">
          {value}
        </p>
        {meta ? (
          <p className="mt-1 text-xs text-muted-foreground">{meta}</p>
        ) : null}
      </CardContent>
    </Card>
  );
}
