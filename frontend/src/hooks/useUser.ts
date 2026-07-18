"use client";

import { useState, useEffect } from "react";
import { userService } from "@/services/userService";

const USER_ID_KEY = "bba_user_id";

export function useUser() {
  const [userId, setUserId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function initUser() {
      try {
        const stored = localStorage.getItem(USER_ID_KEY);

        if (stored) {
          // Verify the user still exists on the backend
          try {
            await userService.getById(stored);
            setUserId(stored);
          } catch {
            // User not found — create a new one
            const user = await userService.create({});
            localStorage.setItem(USER_ID_KEY, user.id);
            setUserId(user.id);
          }
        } else {
          // First visit — create anonymous user
          const user = await userService.create({});
          localStorage.setItem(USER_ID_KEY, user.id);
          setUserId(user.id);
        }
      } catch (err) {
        setError("Failed to initialise user. Is the backend running?");
        console.error(err);
      } finally {
        setLoading(false);
      }
    }

    initUser();
  }, []);

  return { userId, loading, error };
}
