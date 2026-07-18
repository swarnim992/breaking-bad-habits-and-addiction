import api from "@/lib/api";
import type { CheckIn, CheckInCreate } from "@/types/checkin";

export const checkinService = {
  async getByHabitId(habitId: string): Promise<CheckIn[]> {
    const { data } = await api.get<CheckIn[]>(`/checkins/habit/${habitId}`);
    return data;
  },

  async create(payload: CheckInCreate): Promise<CheckIn> {
    const { data } = await api.post<CheckIn>("/checkins", payload);
    return data;
  },
};
