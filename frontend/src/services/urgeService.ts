import api from "@/lib/api";
import type { UrgeEvent, UrgeEventCreate } from "@/types/urge";

export const urgeService = {
  async getByHabitId(habitId: string): Promise<UrgeEvent[]> {
    const { data } = await api.get<UrgeEvent[]>(`/urges/habit/${habitId}`);
    return data;
  },

  async create(payload: UrgeEventCreate): Promise<UrgeEvent> {
    const { data } = await api.post<UrgeEvent>("/urges", payload);
    return data;
  },

  async updateOutcome(urgeId: string, outcome: "resisted" | "gave_in"): Promise<UrgeEvent> {
    const { data } = await api.patch<UrgeEvent>(`/urges/${urgeId}`, { outcome });
    return data;
  },
};
