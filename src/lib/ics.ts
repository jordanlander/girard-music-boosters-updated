import { EventItem } from "@/types/events";

function formatDateForICS(dateIso: string) {
  // Expecting YYYY-MM-DD; produce YYYYMMDD for all-day events
  const [y, m, d] = dateIso.split("-");
  return `${y}${m}${d}`;
}

export function eventToICS(e: EventItem) {
  const dt = formatDateForICS(e.date);
  const dtStamp = new Date().toISOString().replace(/[-:]/g, "").split(".")[0] + "Z";
  const uid = `${e.id}@girard-boosters`;
  const lines = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//Girard Music & Drama Boosters//EN",
    "CALSCALE:GREGORIAN",
    "BEGIN:VEVENT",
    `UID:${uid}`,
    `DTSTAMP:${dtStamp}`,
    `DTSTART;VALUE=DATE:${dt}`,
    `SUMMARY:${escapeText(e.title)}`,
    e.location ? `LOCATION:${escapeText(e.location)}` : undefined,
    e.description ? `DESCRIPTION:${escapeText(e.description)}` : undefined,
    "END:VEVENT",
    "END:VCALENDAR",
  ].filter(Boolean) as string[];
  return lines.join("\r\n");
}

function escapeText(input: string) {
  // Escape commas, semicolons and backslashes per RFC5545
  return input.replace(/\\/g, "\\\\").replace(/,/g, "\\,").replace(/;/g, "\\;").replace(/\n/g, "\\n");
}

export function downloadICSForEvent(e: EventItem) {
  const ics = eventToICS(e);
  const blob = new Blob([ics], { type: "text/calendar;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  const safeTitle = e.title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
  a.download = `${safeTitle || "event"}.ics`;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}
