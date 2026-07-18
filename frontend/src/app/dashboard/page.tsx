"use client";

import { useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { AiInsightsCard } from "@/components/dashboard/AiInsightsCard";
import { AiNudgeCard } from "@/components/dashboard/AiNudgeCard";
import { CheckInCard } from "@/components/dashboard/CheckInCard";
import { DashboardHeader } from "@/components/dashboard/DashboardHeader";
import { DashboardSkeleton } from "@/components/dashboard/DashboardSkeleton";
import { ProgressChart } from "@/components/dashboard/ProgressChart";
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
      <div className="mx-auto flex min-h-[calc(100vh-4rem)] max-w-lg flex-col items-center justify-center gap-4 p-6 text-center">
        <div className="glass w-full p-6">
          <p className="font-semibold text-[#ff8fab]">Unable to load dashboard</p>
          <p className="mt-2 text-sm text-[#8892b0]">
            {error ?? "No habit data found."}
          </p>
          <Link
            href="/"
            className="mt-5 inline-block rounded-xl px-5 py-2 text-sm font-bold text-white"
            style={{ background: "linear-gradient(135deg, #6c63ff, #9f7aea)" }}
          >
            Complete onboarding
          </Link>
        </div>
      </div>
    );
  }

  const streak = calculateStreak(checkins, habit.target_level);

  return (
    <div
      className="min-h-[calc(100vh-4rem)]"
      style={{
        background:
          "radial-gradient(ellipse at top left, rgba(108,99,255,0.12) 0%, transparent 50%), " +
          "radial-gradient(ellipse at bottom right, rgba(255,101,132,0.07) 0%, transparent 50%)",
      }}
    >
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-6 p-6">
        <DashboardHeader streak={streak} />

        <TodaysGoalCard habit={habit} checkins={checkins} />

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
