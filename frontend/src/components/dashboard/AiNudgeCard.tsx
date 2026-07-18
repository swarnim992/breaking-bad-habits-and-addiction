"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/Card";
import { buildDailyNudge } from "@/lib/dashboardUtils";
import type { Habit } from "@/types/habit";

interface AiNudgeCardProps {
  habit: Habit;
}

export function AiNudgeCard({ habit }: AiNudgeCardProps) {
  const nudge = buildDailyNudge(habit);

  return (
    <Card className="animate-fade-in-up">
      <CardHeader>
        <div>
          <CardTitle>✨ AI Daily Nudge</CardTitle>
          <CardDescription className="mt-1">
            Personalized coaching for today
          </CardDescription>
        </div>
      </CardHeader>
      <CardContent>
        <p className="leading-relaxed text-[#c5cae9]">{nudge}</p>
        {!habit.ai_plan && (
          <p className="mt-3 text-xs text-[#8892b0]">
            Full AI nudges arrive in Phase 6 — this preview uses your habit profile.
          </p>
        )}
      </CardContent>
    </Card>
  );
}
