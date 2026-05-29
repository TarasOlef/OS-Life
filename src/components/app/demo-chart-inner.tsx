"use client";

import {
  Area,
  AreaChart,
  CartesianGrid,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import type { DemoChartPoint } from "@/components/app/demo-chart";

export function DemoChartInner({ data }: { data: DemoChartPoint[] }) {
  return (
    <div className="w-full overflow-x-auto">
      <div className="min-w-[40rem]">
        <AreaChart
          width={760}
          height={288}
          data={data}
          margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
        >
          <defs>
            <linearGradient id="lifeScoreDemo" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#38bdf8" stopOpacity={0.36} />
              <stop offset="95%" stopColor="#38bdf8" stopOpacity={0.02} />
            </linearGradient>
          </defs>
          <CartesianGrid stroke="var(--border)" strokeDasharray="3 3" />
          <XAxis
            dataKey="day"
            axisLine={false}
            tickLine={false}
            tick={{ fill: "var(--muted-foreground)", fontSize: 12 }}
          />
          <YAxis
            axisLine={false}
            tickLine={false}
            domain={[50, 100]}
            tick={{ fill: "var(--muted-foreground)", fontSize: 12 }}
          />
          <Tooltip
            contentStyle={{
              background: "var(--card)",
              border: "1px solid var(--border)",
              borderRadius: "8px",
              color: "var(--foreground)",
            }}
            labelStyle={{ color: "var(--foreground)" }}
            formatter={(value) => [`${value}`, "Demo score"]}
          />
          <Area
            type="monotone"
            dataKey="score"
            stroke="#38bdf8"
            strokeWidth={2}
            fill="url(#lifeScoreDemo)"
          />
        </AreaChart>
      </div>
    </div>
  );
}
