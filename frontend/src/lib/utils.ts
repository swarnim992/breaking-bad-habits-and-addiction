import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

/** Merge class names using clsx and tailwind-merge. */
export function cn(...classes: ClassValue[]): string {
  return twMerge(clsx(classes));
}

/** Capitalize the first letter of a string. */
export function capitalize(str: string): string {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

/** Format an ISO date string to a locale-friendly date. */
export function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

/** Sleep for `ms` milliseconds (useful in tests / retry loops). */
export function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
