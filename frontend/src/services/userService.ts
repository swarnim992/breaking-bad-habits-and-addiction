import api from "@/lib/api";
import type { User } from "@/types/user";

export const userService = {
  /** Fetch a single user by ID. */
  async getById(id: string): Promise<User> {
    const { data } = await api.get<User>(`/users/${id}`);
    return data;
  },

  /** Create a new anonymous user (backend generates UUID if no id provided). */
  async create(payload: { id?: string } = {}): Promise<User> {
    const { data } = await api.post<User>("/users", payload);
    return data;
  },
};
