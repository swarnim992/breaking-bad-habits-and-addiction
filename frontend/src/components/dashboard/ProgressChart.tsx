"use client";

import {
  CartesianGrid,
  Line,
  LineChart,
  ReferenceLine,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { buildChartData, calculateImprovement } from "@/lib/dashboardUtils";
import type { CheckIn } from "@/types/checkin";
import type { Habit } from "@/types/habit";

interface ProgressChartProps {
  habit: Habit;
  checkins: CheckIn[];
}

export function ProgressChart({ habit, checkins }: ProgressChartProps) {
  const data = buildChartData(habit, checkins);
  const improvement = calculateImprovement(checkins);
  const unit = habit.unit ?? "units";

  return (
    <Card className="flex h-full flex-col animate-fade-in-up border-border bg-card shadow-md">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-4">
          <div>
            <CardTitle className="text-base font-semibold text-card-foreground">
              Progress Chart
            </CardTitle>
            <CardDescription className="mt-0.5">
              {improvement !== null && improvement > 0
                ? `↓ ${improvement}% improvement since you started`
                : "Track your habit usage over time"}
            </CardDescription>
          </div>
          {improvement !== null && improvement > 0 && (
            <Badge className="shrink-0 bg-green-500/15 text-green-400 border-green-500/30">
              ↓ {improvement}%
            </Badge>
          )}
        </div>
      </CardHeader>

      <CardContent className="min-h-[280px] flex-1">
        {data.length <= 1 ? (
          <div className="flex h-[240px] flex-col items-center justify-center gap-3 text-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-muted text-3xl">
              📈
            </div>
            <div>
              <p className="text-sm font-medium text-foreground">No data yet</p>
              <p className="text-xs text-muted-foreground mt-1">
                Log your first check-in to see your progress chart.
              </p>
            </div>
          </div>
        ) : (
          <ResponsiveContainer width="100%" height={240}>
            <LineChart data={data} margin={{ top: 8, right: 8, left: -16, bottom: 0 }}>
              <CartesianGrid
                stroke="oklch(0.3416 0.0444 308.8496 / 0.5)"
                vertical={false}
                strokeDasharray="3 3"
              />
              <XAxis
                dataKey="label"
                tick={{ fill: "oklch(0.7137 0.0192 261.3246)", fontSize: 11 }}
                axisLine={false}
                tickLine={false}
              />
              <YAxis
                tick={{ fill: "oklch(0.7137 0.0192 261.3246)", fontSize: 11 }}
                axisLine={false}
                tickLine={false}
                width={32}
              />
              <Tooltip
                contentStyle={{
                  background: "oklch(0.2805 0.0309 307.2326)",
                  border: "1px solid oklch(0.3416 0.0444 308.8496)",
                  borderRadius: "12px",
                  color: "oklch(0.9299 0.0334 272.7879)",
                  fontSize: "13px",
                }}
                formatter={(value) => [`${value} ${unit}`, "Usage"]}
              />
              <ReferenceLine
                y={habit.target_level}
                stroke="oklch(0.6056 0.2189 292.7172)"
                strokeDasharray="5 4"
                label={{
                  value: "Target",
                  fill: "oklch(0.6056 0.2189 292.7172)",
                  fontSize: 11,
                  position: "insideTopRight",
                }}
              />
              <Line
                type="monotone"
                dataKey="value"
                stroke="oklch(0.7874 0.1179 295.7538)"
                strokeWidth={2.5}
                dot={{ fill: "oklch(0.7090 0.1592 293.5412)", r: 4, strokeWidth: 0 }}
                activeDot={{ r: 6, fill: "oklch(0.7874 0.1179 295.7538)", strokeWidth: 0 }}
              />
            </LineChart>
          </ResponsiveContainer>
        )}
      </CardContent>
    </Card>
  );
}
