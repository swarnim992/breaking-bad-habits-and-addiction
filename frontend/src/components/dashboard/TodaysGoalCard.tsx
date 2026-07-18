"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { getGoalProgress, getTodayCheckIn } from "@/lib/dashboardUtils";
import type { CheckIn } from "@/types/checkin";
import type { Habit } from "@/types/habit";

interface TodaysGoalCardProps {
  habit: Habit;
  checkins: CheckIn[];
}

export function TodaysGoalCard({ habit, checkins }: TodaysGoalCardProps) {
  const todayCheckIn = getTodayCheckIn(checkins);
  const todayValue = todayCheckIn?.progress ?? habit.current_level;
  const unit = habit.unit ?? "units";
  const goalPct = getGoalProgress(
    todayCheckIn?.progress ?? null,
    habit.current_level,
    habit.target_level
  );

  const isOnTarget = todayValue <= habit.target_level;
  const reduction = habit.current_level - habit.target_level;

  return (
    <Card className="animate-fade-in-up border-border bg-card shadow-md">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-4">
          <div>
            <CardTitle className="text-base font-semibold text-card-foreground">
              Today&apos;s Goal
            </CardTitle>
            <CardDescription className="mt-1">
              Reduce{" "}
              <span className="font-medium text-foreground">
                {habit.habit_name}
              </span>{" "}
              toward your target
            </CardDescription>
          </div>
          <Badge
            className={
              isOnTarget && todayCheckIn
                ? "bg-green-500/15 text-green-400 border-green-500/30 shrink-0"
                : "bg-primary/15 text-primary border-primary/30 shrink-0"
            }
          >
            {isOnTarget && todayCheckIn ? "✓ On Target" : "In Progress"}
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="space-y-5">
        {/* Stats row */}
        <div className="grid grid-cols-3 gap-3">
          <div className="rounded-lg bg-muted/60 p-3 text-center">
            <p className="text-xs text-muted-foreground mb-1">Current</p>
            <p className="text-lg font-bold text-foreground">{habit.current_level}</p>
            <p className="text-xs text-muted-foreground">{unit}</p>
          </div>
          <div className="rounded-lg bg-primary/10 border border-primary/20 p-3 text-center">
            <p className="text-xs text-muted-foreground mb-1">Today</p>
            <p className="text-lg font-bold text-primary">{todayValue}</p>
            <p className="text-xs text-muted-foreground">{unit}</p>
          </div>
          <div className="rounded-lg bg-muted/60 p-3 text-center">
            <p className="text-xs text-muted-foreground mb-1">Target</p>
            <p className="text-lg font-bold text-green-400">{habit.target_level}</p>
            <p className="text-xs text-muted-foreground">{unit}</p>
          </div>
        </div>

        {/* Progress bar */}
        <div className="space-y-2">
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>Progress toward goal</span>
            <span className="font-semibold text-primary">{Math.round(goalPct)}%</span>
          </div>
          <Progress value={goalPct} className="h-2.5" />
          <p className="text-xs text-muted-foreground">
            {todayCheckIn
              ? `Logged today · reduce by ${reduction.toFixed(1)} ${unit} total`
              : "Log a check-in to update your progress"}
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
