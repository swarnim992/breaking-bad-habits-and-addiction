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
} from "@/components/ui/Card";
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
    <Card className="flex h-full flex-col animate-fade-in-up">
      <CardHeader>
        <div>
          <CardTitle>Progress</CardTitle>
          <CardDescription className="mt-1">
            {improvement !== null && improvement > 0
              ? `↓ ${improvement}% improvement since you started`
              : "Track your habit usage over time"}
          </CardDescription>
        </div>
      </CardHeader>
      <CardContent className="min-h-[280px] flex-1">
        {data.length <= 1 ? (
          <div className="flex h-[240px] flex-col items-center justify-center gap-2 text-center">
            <p className="text-4xl">📈</p>
            <p className="text-sm text-[#8892b0]">
              Log your first check-in to see your progress chart.
            </p>
          </div>
        ) : (
          <ResponsiveContainer width="100%" height={240}>
            <LineChart data={data} margin={{ top: 8, right: 8, left: -16, bottom: 0 }}>
              <CartesianGrid stroke="rgba(255,255,255,0.06)" vertical={false} />
              <XAxis
                dataKey="label"
                tick={{ fill: "#8892b0", fontSize: 12 }}
                axisLine={false}
                tickLine={false}
              />
              <YAxis
                tick={{ fill: "#8892b0", fontSize: 12 }}
                axisLine={false}
                tickLine={false}
                width={32}
              />
              <Tooltip
                contentStyle={{
                  background: "#151828",
                  border: "1px solid rgba(255,255,255,0.08)",
                  borderRadius: "12px",
                  color: "#e8eaf6",
                }}
                formatter={(value) => [`${value} ${unit}`, "Usage"]}
              />
              <ReferenceLine
                y={habit.target_level}
                stroke="#4ade80"
                strokeDasharray="4 4"
                label={{
                  value: "Target",
                  fill: "#4ade80",
                  fontSize: 11,
                  position: "insideTopRight",
                }}
              />
              <Line
                type="monotone"
                dataKey="value"
                stroke="#6c63ff"
                strokeWidth={3}
                dot={{ fill: "#9f7aea", r: 4 }}
                activeDot={{ r: 6, fill: "#6c63ff" }}
              />
            </LineChart>
          </ResponsiveContainer>
        )}
      </CardContent>
    </Card>
  );
}
