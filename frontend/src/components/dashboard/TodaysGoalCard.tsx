"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/Card";
import { Progress } from "@/components/ui/Progress";
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
  const goalPct = getGoalProgress(todayCheckIn?.progress ?? null, habit.current_level, habit.target_level);

  return (
    <Card glow className="animate-fade-in-up">
      <CardHeader>
        <div>
          <CardTitle>Today&apos;s Goal</CardTitle>
          <CardDescription className="mt-1">
            Reduce {habit.habit_name} toward your target
          </CardDescription>
        </div>
      </CardHeader>
      <CardContent>
        <div className="mb-4 flex items-end justify-between gap-4">
          <div>
            <p className="text-2xl font-bold text-[#e8eaf6]">{habit.habit_name}</p>
            <p className="mt-1 text-sm text-[#8892b0]">
              Target: {habit.target_level} {unit}
            </p>
          </div>
          <div className="text-right">
            <p className="text-2xl font-bold text-[#8b85ff]">
              {todayValue} <span className="text-base font-medium text-[#8892b0]">{unit}</span>
            </p>
            <p className="text-xs text-[#8892b0]">
              {todayCheckIn ? "Logged today" : "Not checked in yet"}
            </p>
          </div>
        </div>
        <Progress value={goalPct} />
        <p className="mt-3 text-sm text-[#8892b0]">
          {Math.round(goalPct)}% toward your reduction goal
          {todayCheckIn ? "" : " — log a check-in to update today's progress"}
        </p>
      </CardContent>
    </Card>
  );
}
