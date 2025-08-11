import type { CalendarType } from "@/types/events";

interface Props {
  label: CalendarType;
  active: boolean;
  onClick: () => void;
}

export function CategoryChip({ label, active, onClick }: Props) {
  return (
    <button
      onClick={onClick}
      className={
        `px-3 py-1 rounded-full text-sm border transition-colors ` +
        (active
          ? "bg-primary text-primary-foreground border-transparent"
          : "bg-background text-foreground border-border hover:bg-muted")
      }
      aria-pressed={active}
    >
      {label}
    </button>
  );
}
