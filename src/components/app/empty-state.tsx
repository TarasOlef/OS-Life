import type { LucideIcon } from "lucide-react";
import { Button } from "@/components/ui/button";

type EmptyStateProps = {
  title: string;
  description: string;
  icon?: LucideIcon;
  actionLabel?: string;
};

export function EmptyState({
  title,
  description,
  icon: Icon,
  actionLabel,
}: EmptyStateProps) {
  return (
    <div className="flex min-h-52 flex-col items-center justify-center rounded-lg border border-dashed border-border bg-secondary/30 p-6 text-center">
      {Icon ? (
        <div className="mb-4 flex size-11 items-center justify-center rounded-lg border border-border bg-card">
          <Icon className="size-5 text-muted-foreground" aria-hidden="true" />
        </div>
      ) : null}
      <h3 className="text-base font-semibold text-foreground">{title}</h3>
      <p className="mt-2 max-w-md text-sm leading-6 text-muted-foreground">
        {description}
      </p>
      {actionLabel ? (
        <Button className="mt-5" variant="secondary" type="button">
          {actionLabel}
        </Button>
      ) : null}
    </div>
  );
}
