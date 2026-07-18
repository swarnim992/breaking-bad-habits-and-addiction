"use client";

import { Badge } from "@/components/ui/badge";
import { getGreeting } from "@/lib/dashboardUtils";

interface DashboardHeaderProps {
  streak: number;
  habitName: string;
}

export function DashboardHeader({ streak, habitName }: DashboardHeaderProps) {
  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between animate-fade-in-up">
      <div className="space-y-1">
        <p className="text-sm text-muted-foreground font-medium">
          {getGreeting()} 👋
        </p>
        <h1 className="text-3xl font-extrabold tracking-tight text-foreground">
          Your Dashboard
        </h1>
        <p className="text-sm text-muted-foreground">
          Tracking{" "}
          <span className="font-semibold text-primary">{habitName}</span>
        </p>
      </div>

      <div className="flex items-center gap-2 self-start">
        {streak > 0 ? (
          <Badge
            className="gap-1.5 rounded-full px-3 py-1.5 text-sm font-semibold
              bg-primary/15 text-primary border-primary/30 hover:bg-primary/20"
          >
            🔥 {streak} Day Streak
          </Badge>
        ) : (
          <Badge
            variant="secondary"
            className="gap-1.5 rounded-full px-3 py-1.5 text-sm font-semibold"
          >
            Start your streak today
          </Badge>
        )}
      </div>
    </div>
  );
}
