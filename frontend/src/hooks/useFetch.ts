"use client";

import { useState, useEffect, useCallback } from "react";
import api from "@/lib/api";

interface FetchState<T> {
  data: T | null;
  isLoading: boolean;
  error: string | null;
  refetch: () => void;
}

/**
 * Generic data-fetching hook.
 *
 * @example
 * const { data, isLoading, error } = useFetch<User[]>("/users");
 */
export function useFetch<T>(url: string): FetchState<T> {
  const [data, setData] = useState<T | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [tick, setTick] = useState(0);

  const refetch = useCallback(() => setTick((t) => t + 1), []);

  useEffect(() => {
    let cancelled = false;
    setIsLoading(true);
    setError(null);

    api
      .get<T>(url)
      .then(({ data }) => {
        if (!cancelled) setData(data);
      })
      .catch((err) => {
        if (!cancelled)
          setError(err.response?.data?.detail ?? err.message ?? "Unknown error");
      })
      .finally(() => {
        if (!cancelled) setIsLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [url, tick]);

  return { data, isLoading, error, refetch };
}
