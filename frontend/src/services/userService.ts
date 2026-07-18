import api from "@/lib/api";
import type { User } from "@/types/user";

export const userService = {
  /** Fetch all users. */
  async getAll(): Promise<User[]> {
    const { data } = await api.get<User[]>("/users");
    return data;
  },

  /** Fetch a single user by ID. */
  async getById(id: string): Promise<User> {
    const { data } = await api.get<User>(`/users/${id}`);
    return data;
  },

  /** Create a new user. */
  async create(payload: Omit<User, "id">): Promise<User> {
    const { data } = await api.post<User>("/users", payload);
    return data;
  },
};
