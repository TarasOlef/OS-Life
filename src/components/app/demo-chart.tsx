"use client";

import dynamic from "next/dynamic";

export type DemoChartPoint = {
  day: string;
  score: number;
};

const DemoChartInner = dynamic(
  () =>
    import("@/components/app/demo-chart-inner").then(
      (mod) => mod.DemoChartInner,
    ),
  {
    ssr: false,
    loading: () => <div className="h-72 w-full rounded-md bg-secondary/30" />,
  },
);

export function DemoChart({ data }: { data: DemoChartPoint[] }) {
  return <DemoChartInner data={data} />;
}
