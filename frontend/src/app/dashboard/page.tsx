"use client";

import { useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { AiInsightsCard } from "@/components/dashboard/AiInsightsCard";
import { AiNudgeCard } from "@/components/dashboard/AiNudgeCard";
import { CheckInCard } from "@/components/dashboard/CheckInCard";
import { DashboardHeader } from "@/components/dashboard/DashboardHeader";
import { DashboardSkeleton } from "@/components/dashboard/DashboardSkeleton";
import { ProgressChart } from "@/components/dashboard/ProgressChart";
import { ProgressStatsCard } from "@/components/dashboard/ProgressStatsCard";
import { TodaysGoalCard } from "@/components/dashboard/TodaysGoalCard";
import { UrgeSupportButton } from "@/components/dashboard/UrgeSupportButton";
import { calculateStreak } from "@/lib/dashboardUtils";
import { useDashboard } from "@/hooks/useDashboard";

const HABIT_ID_KEY = "bba_habit_id";

export default function DashboardPage() {
  const router = useRouter();
  const { habit, checkins, urges, loading, error, refresh } = useDashboard();

  useEffect(() => {
    const habitId = localStorage.getItem(HABIT_ID_KEY);
    if (!loading && !habitId) {
      router.replace("/");
    }
  }, [loading, router]);

  if (loading) {
    return <DashboardSkeleton />;
  }

  if (error || !habit) {
    return (
      <div className="mx-auto flex min-h-[calc(100vh-4rem)] max-w-md flex-col items-center justify-center gap-4 p-6 text-center">
        <div className="w-full rounded-2xl border border-border bg-card p-8 shadow-lg space-y-4">
          <div className="text-4xl">⚠️</div>
          <div>
            <p className="font-semibold text-foreground text-lg">
              Unable to load dashboard
            </p>
            <p className="mt-2 text-sm text-muted-foreground">
              {error ?? "No habit data found. Complete onboarding first."}
            </p>
          </div>
          <Button asChild className="w-full">
            <Link href="/">Complete onboarding</Link>
          </Button>
        </div>
      </div>
    );
  }

  const streak = calculateStreak(checkins, habit.target_level);

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-background">
      {/* Subtle gradient overlay */}
      <div
        className="pointer-events-none fixed inset-0 z-0"
        style={{
          background:
            "radial-gradient(ellipse 80% 50% at 20% 0%, oklch(0.7874 0.1179 295.7538 / 0.08) 0%, transparent 60%), " +
            "radial-gradient(ellipse 60% 40% at 80% 100%, oklch(0.5413 0.2466 293.009 / 0.05) 0%, transparent 60%)",
        }}
      />

      <div className="relative z-10 mx-auto flex w-full max-w-6xl flex-col gap-6 p-6">
        <DashboardHeader streak={streak} habitName={habit.habit_name} />

        <TodaysGoalCard habit={habit} checkins={checkins} />

        <ProgressStatsCard
          habit={habit}
          checkins={checkins}
          urges={urges}
          streak={streak}
        />

        <AiNudgeCard habit={habit} />

        <UrgeSupportButton habit={habit} onComplete={refresh} />

        <div className="grid gap-6 lg:grid-cols-2">
          <CheckInCard habit={habit} onComplete={refresh} />
          <ProgressChart habit={habit} checkins={checkins} />
        </div>

        <AiInsightsCard habit={habit} checkins={checkins} urges={urges} />
      </div>
    </div>
  );
}
