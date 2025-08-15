import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar as CalendarIcon, MapPin } from "lucide-react";
import { downloadICSForEvent } from "@/lib/ics";
import type { EventItem } from "@/types/events";
import { normalizeEventDate } from "@/lib/utils";

interface Props {
  event: EventItem;
}

export default function EventCard({ event }: Props) {
  const date = normalizeEventDate(event.date);
  const dateStr = date.toLocaleDateString(undefined, {
    weekday: "short",
    month: "short",
    day: "numeric",
  });

  return (
    <Card className="border-border">
      <CardContent className="p-4">
        <div className="text-sm text-muted-foreground">{dateStr}</div>
        <div className="mt-1 font-medium">{event.title}</div>
        {event.location && (
          <div className="mt-1 text-sm text-muted-foreground flex items-center gap-1">
            <MapPin className="h-3.5 w-3.5" />
            <span>{event.location}</span>
          </div>
        )}
        <div className="mt-3 flex items-center justify-between">
          <div className="text-xs text-muted-foreground">{event.calendar}</div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => downloadICSForEvent(event)}
            aria-label={`Add ${event.title} to your calendar`}
          >
            <CalendarIcon className="h-4 w-4 mr-2" /> Add to Calendar
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
