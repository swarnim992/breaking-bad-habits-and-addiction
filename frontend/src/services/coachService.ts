import api from "@/lib/api";
import type { Habit } from "@/types/habit";

export const coachService = {
  /** Generate a personalized behavior-change plan for the habit. */
  async generatePlan(habitId: string): Promise<Habit> {
    const { data } = await api.post<Habit>("/coach/generate-plan", {
      habit_id: habitId,
    });
    return data;
  },

  /** Get AI insights for the habit. */
  async getInsights(habitId: string): Promise<any> {
    const { data } = await api.get<any>(`/coach/insights/${habitId}`);
    return data;
  },
};
