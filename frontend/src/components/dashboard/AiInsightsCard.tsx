"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { buildInsights, type DashboardInsights } from "@/lib/dashboardUtils";
import { coachService } from "@/services/coachService";
import type { CheckIn } from "@/types/checkin";
import type { Habit } from "@/types/habit";
import type { UrgeEvent } from "@/types/urge";
import { useEffect, useState } from "react";
import { Skeleton } from "@/components/ui/skeleton";

interface AiInsightsCardProps {
  habit: Habit;
  checkins: CheckIn[];
  urges: UrgeEvent[];
}

const INSIGHT_ICONS: Record<string, string> = {
  "Biggest Trigger": "⚡",
  "Pattern": "📊",
  "Progress": "📈",
  "Recommendation": "💡",
};

export function AiInsightsCard({ habit, checkins, urges }: AiInsightsCardProps) {
  const [insights, setInsights] = useState<DashboardInsights | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    async function loadInsights() {
      setLoading(true);
      try {
        const data = await coachService.getInsights(habit.id);
        if (mounted) {
          setInsights(data);
        }
      } catch (err) {
        console.error("Failed to fetch insights, using local fallback", err);
        if (mounted) {
          setInsights(buildInsights(habit, checkins, urges));
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    }

    loadInsights();

    return () => {
      mounted = false;
    };
  }, [habit, checkins, urges]);

  const displayInsights = insights || buildInsights(habit, checkins, urges);

  const rows = [
    { label: "Biggest Trigger", value: displayInsights.biggestTrigger },
    { label: "Pattern", value: displayInsights.pattern },
    { label: "Progress", value: displayInsights.progressText },
    { label: "Recommendation", value: displayInsights.recommendation },
  ];

  return (
    <Card className="animate-fade-in-up border-border bg-card shadow-md">
      <CardHeader className="pb-4">
        <div className="flex items-start gap-3">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-muted text-lg">
            🧠
          </div>
          <div>
            <CardTitle className="text-base font-semibold text-card-foreground">
              AI Insights
            </CardTitle>
            <CardDescription className="mt-0.5">
              Patterns learned from your habit profile and activity
            </CardDescription>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-0">
        {loading && !insights ? (
          <div className="space-y-4 py-4">
            <Skeleton className="h-12 w-full" />
            <Skeleton className="h-12 w-full" />
            <Skeleton className="h-12 w-full" />
            <Skeleton className="h-12 w-full" />
          </div>
        ) : (
          <>
            {rows.map((row, idx) => (
              <div key={row.label}>
                <div className="flex gap-3 py-4">
                  <span className="text-lg leading-none mt-0.5">
                    {INSIGHT_ICONS[row.label]}
                  </span>
                  <div className="space-y-1 flex-1 min-w-0">
                    <p className="text-xs font-semibold uppercase tracking-widest text-primary">
                      {row.label}
                    </p>
                    <p className="text-sm leading-relaxed text-foreground/80">
                      {row.value}
                    </p>
                  </div>
                </div>
                {idx < rows.length - 1 && <Separator className="bg-border/60" />}
              </div>
            ))}
          </>
        )}
      </CardContent>
    </Card>
  );
}
