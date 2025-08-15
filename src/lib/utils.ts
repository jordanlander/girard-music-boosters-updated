import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Parse an event date string in MM-DD-YYYY or YYYY-MM-DD format and
// construct a Date object in the local timezone without any UTC shift.
export function normalizeEventDate(dateStr: string): Date {
  const parts = dateStr.split("-");
  let month: number, day: number, year: number;
  if (parts[0].length === 4) {
    // YYYY-MM-DD
    [year, month, day] = parts.map(Number);
  } else {
    // MM-DD-YYYY
    [month, day, year] = parts.map(Number);
  }
  return new Date(year, month - 1, day);
}
