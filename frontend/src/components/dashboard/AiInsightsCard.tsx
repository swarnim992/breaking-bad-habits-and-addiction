"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/Card";
import { buildInsights } from "@/lib/dashboardUtils";
import type { CheckIn } from "@/types/checkin";
import type { Habit } from "@/types/habit";
import type { UrgeEvent } from "@/types/urge";

interface AiInsightsCardProps {
  habit: Habit;
  checkins: CheckIn[];
  urges: UrgeEvent[];
}

export function AiInsightsCard({ habit, checkins, urges }: AiInsightsCardProps) {
  const insights = buildInsights(habit, checkins, urges);

  const rows = [
    { label: "Biggest Trigger", value: insights.biggestTrigger },
    { label: "Pattern", value: insights.pattern },
    { label: "Progress", value: insights.progressText },
    { label: "Recommendation", value: insights.recommendation },
  ];

  return (
    <Card className="animate-fade-in-up">
      <CardHeader>
        <div>
          <CardTitle>AI Insights</CardTitle>
          <CardDescription className="mt-1">
            Patterns learned from your habit profile and activity
          </CardDescription>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid gap-4 md:grid-cols-2">
          {rows.map((row) => (
            <div
              key={row.label}
              className="rounded-xl border border-[rgba(255,255,255,0.06)] bg-[rgba(255,255,255,0.02)] p-4"
            >
              <p className="text-xs font-semibold uppercase tracking-wide text-[#6c63ff]">
                {row.label}
              </p>
              <p className="mt-2 text-sm leading-relaxed text-[#c5cae9]">{row.value}</p>
            </div>
          ))}
        </div>
        <p className="mt-4 text-xs text-[#8892b0]">
          Full AI insights arrive in Phase 10 — this preview is computed from your dashboard data.
        </p>
      </CardContent>
    </Card>
  );
}
