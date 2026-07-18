import api from "@/lib/api";
import type { Habit, HabitCreate } from "@/types/habit";

export const habitService = {
  /** Create a new habit. */
  async createHabit(payload: HabitCreate): Promise<Habit> {
    const { data } = await api.post<Habit>("/habits", payload);
    return data;
  },

  /** Fetch a single habit by ID. */
  async getById(habitId: string): Promise<Habit> {
    const { data } = await api.get<Habit>(`/habits/${habitId}`);
    return data;
  },

  /** Fetch all habits for a user. */
  async getByUserId(userId: string): Promise<Habit[]> {
    const { data } = await api.get<Habit[]>("/habits", {
      params: { user_id: userId },
    });
    return data;
  },
};
