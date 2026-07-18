"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  calculateImprovement,
  getGoalProgress,
  getTodayCheckIn,
} from "@/lib/dashboardUtils";
import type { CheckIn } from "@/types/checkin";
import type { Habit } from "@/types/habit";
import type { UrgeEvent } from "@/types/urge";

interface ProgressStatsCardProps {
  habit: Habit;
  checkins: CheckIn[];
  urges: UrgeEvent[];
  streak: number;
}

interface StatItem {
  label: string;
  value: string;
  hint: string;
}

export function ProgressStatsCard({
  habit,
  checkins,
  urges,
  streak,
}: ProgressStatsCardProps) {
  const todayCheckIn = getTodayCheckIn(checkins);
  const goalPct = getGoalProgress(
    todayCheckIn?.progress ?? null,
    habit.current_level,
    habit.target_level
  );
  const improvement = calculateImprovement(checkins);
  const resistedUrges = urges.filter((u) => u.outcome === "resisted").length;

  const stats: StatItem[] = [
    {
      label: "Check-ins",
      value: String(checkins.length),
      hint: checkins.length === 1 ? "day logged" : "days logged",
    },
    {
      label: "Streak",
      value: String(streak),
      hint: streak === 1 ? "day on target" : "days on target",
    },
    {
      label: "Urges resisted",
      value: String(resistedUrges),
      hint: resistedUrges === 1 ? "win logged" : "wins logged",
    },
    {
      label: "Goal progress",
      value: `${Math.round(goalPct)}%`,
      hint:
        improvement !== null && improvement > 0
          ? `↓ ${improvement}% since start`
          : "toward your target",
    },
  ];

  return (
    <Card className="animate-fade-in-up border-border bg-card shadow-md">
      <CardHeader className="pb-3">
        <CardTitle className="text-base font-semibold text-card-foreground">
          Your Progress
        </CardTitle>
        <CardDescription>
          Tracking how your behavior is improving over time
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          {stats.map((stat) => (
            <div
              key={stat.label}
              className="rounded-xl border border-border bg-muted/40 p-4 text-center"
            >
              <p className="text-xs text-muted-foreground mb-1">{stat.label}</p>
              <p className="text-2xl font-bold text-foreground">{stat.value}</p>
              <p className="text-xs text-muted-foreground mt-1">{stat.hint}</p>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
