"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { buildDailyNudge } from "@/lib/dashboardUtils";
import type { Habit } from "@/types/habit";

interface AiNudgeCardProps {
  habit: Habit;
}

export function AiNudgeCard({ habit }: AiNudgeCardProps) {
  const nudge = buildDailyNudge(habit);

  return (
    <Card className="animate-fade-in-up border-primary/20 bg-primary/5 shadow-md">
      <CardHeader className="pb-3">
        <div className="flex items-start gap-3">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary/15 text-lg">
            ✨
          </div>
          <div>
            <CardTitle className="text-base font-semibold text-card-foreground">
              AI Daily Nudge
            </CardTitle>
            <CardDescription className="mt-0.5">
              Personalized coaching for today
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <p className="leading-relaxed text-foreground/90 text-sm">{nudge}</p>
        {!habit.ai_plan && (
          <p className="mt-3 text-xs text-muted-foreground border-t border-border pt-3">
            💡 Full AI nudges arrive in Phase 6 — preview based on your habit profile.
          </p>
        )}
      </CardContent>
    </Card>
  );
}
