"use client";

import { Badge } from "@/components/ui/Badge";
import { getGreeting } from "@/lib/dashboardUtils";

interface DashboardHeaderProps {
  streak: number;
}

export function DashboardHeader({ streak }: DashboardHeaderProps) {
  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <p className="text-sm text-[#8892b0]">{getGreeting()} 👋</p>
        <h1 className="mt-1 text-3xl font-extrabold tracking-tight text-[#e8eaf6]">
          Your recovery dashboard
        </h1>
      </div>
      <Badge variant={streak > 0 ? "success" : "default"} className="self-start text-sm">
        🔥 {streak} Day Streak
      </Badge>
    </div>
  );
}
