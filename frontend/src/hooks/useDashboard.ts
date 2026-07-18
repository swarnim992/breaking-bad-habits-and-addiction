"use client";

import { useCallback, useEffect, useState } from "react";
import { habitService } from "@/services/habitService";
import { checkinService } from "@/services/checkinService";
import { urgeService } from "@/services/urgeService";
import type { CheckIn } from "@/types/checkin";
import type { Habit } from "@/types/habit";
import type { UrgeEvent } from "@/types/urge";

const HABIT_ID_KEY = "bba_habit_id";

export function useDashboard() {
  const [habit, setHabit] = useState<Habit | null>(null);
  const [checkins, setCheckins] = useState<CheckIn[]>([]);
  const [urges, setUrges] = useState<UrgeEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const habitId = localStorage.getItem(HABIT_ID_KEY);
      if (!habitId) {
        setError("No habit found. Please complete onboarding first.");
        setHabit(null);
        setCheckins([]);
        setUrges([]);
        return;
      }

      const [habitData, checkinData, urgeData] = await Promise.all([
        habitService.getById(habitId),
        checkinService.getByHabitId(habitId),
        urgeService.getByHabitId(habitId),
      ]);

      setHabit(habitData);
      setCheckins(checkinData);
      setUrges(urgeData);
    } catch (err) {
      console.error(err);
      setError("Failed to load dashboard data. Is the backend running?");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  return {
    habit,
    checkins,
    urges,
    loading,
    error,
    refresh: load,
  };
}
