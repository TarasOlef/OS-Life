import type { LucideIcon } from "lucide-react";
import { DashboardCard } from "@/components/app/dashboard-card";
import { EmptyState } from "@/components/app/empty-state";
import { MetricCard } from "@/components/app/metric-card";
import { PageHeader } from "@/components/app/page-header";
import { SectionTitle } from "@/components/app/section-title";

type ModuleMetric = {
  title: string;
  value: string;
  description: string;
  icon: LucideIcon;
};

type ModuleCard = {
  title: string;
  description: string;
  body: string;
};

type ModulePageProps = {
  eyebrow: string;
  title: string;
  description: string;
  metrics: ModuleMetric[];
  cards?: ModuleCard[];
  emptyState?: {
    title: string;
    description: string;
    icon: LucideIcon;
    actionLabel?: string;
  };
};

export function ModulePage({
  eyebrow,
  title,
  description,
  metrics,
  cards = [],
  emptyState,
}: ModulePageProps) {
  return (
    <>
      <PageHeader eyebrow={eyebrow} title={title} description={description} />

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {metrics.map((metric) => (
          <MetricCard key={metric.title} {...metric} />
        ))}
      </section>

      {cards.length > 0 ? (
        <section className="grid gap-4 lg:grid-cols-2">
          {cards.map((card) => (
            <DashboardCard
              key={card.title}
              title={card.title}
              description={card.description}
            >
              <p className="text-sm leading-6 text-muted-foreground">
                {card.body}
              </p>
            </DashboardCard>
          ))}
        </section>
      ) : null}

      {emptyState ? (
        <section className="space-y-3">
          <SectionTitle title="Activity" />
          <EmptyState {...emptyState} />
        </section>
      ) : null}
    </>
  );
}
