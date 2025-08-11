export type CalendarType = "Band" | "Drama" | "Fundraising" | "General";

export type EventItem = {
  id: string;
  title: string;
  date: string; // ISO date (YYYY-MM-DD)
  calendar: CalendarType;
  location?: string;
  description?: string;
};
