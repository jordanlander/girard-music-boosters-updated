import { useEffect, useRef, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";
import type { CalendarType } from "@/types/events";

export type EventRow = {
  id: string;
  title: string;
  date: string; // YYYY-MM-DD
  calendar: CalendarType;
  location: string | null;
  description: string | null;
  published: boolean;
};

const CALENDARS: CalendarType[] = ["Band", "Drama", "Fundraising", "General"];

export default function EventsManager() {
  const [items, setItems] = useState<EventRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [savingId, setSavingId] = useState<string | null>(null);
  const [creating, setCreating] = useState(false);
  const [importing, setImporting] = useState(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [draft, setDraft] = useState<Omit<EventRow, "id">>({
    title: "",
    date: new Date().toISOString().slice(0, 10),
    calendar: "General",
    location: "",
    description: "",
    published: true,
  });

  const load = async () => {
    setLoading(true);
    const { data, error } = await (supabase as any)
      .from("events")
      .select("id,title,date,calendar,location,description,published")
      .order("date", { ascending: true });
    if (error) {
      toast.error("Failed to load events", { description: error.message });
    } else {
      setItems((data as EventRow[]) ?? []);
    }
    setLoading(false);
  };

  useEffect(() => {
    load();
  }, []);

  const parseCsvLine = (line: string) => {
    const result: string[] = [];
    let current = "";
    let inQuotes = false;
    for (let i = 0; i < line.length; i++) {
      const char = line[i];
      if (char === "\"") {
        if (inQuotes && line[i + 1] === "\"") {
          current += "\"";
          i++;
        } else {
          inQuotes = !inQuotes;
        }
      } else if (char === "," && !inQuotes) {
        result.push(current);
        current = "";
      } else {
        current += char;
      }
    }
    result.push(current);
    return result;
  };

  const parseCsv = (text: string) => {
    const lines = text.trim().split(/\r?\n/).filter((l) => l.trim());
    if (!lines.length) return [] as Record<string, string>[];
    const headers = parseCsvLine(lines[0]).map((h) => h.trim().toLowerCase());
    return lines.slice(1).map((line) => {
      const values = parseCsvLine(line);
      const record: Record<string, string> = {};
      headers.forEach((h, i) => {
        const raw = values[i] ?? "";
        record[h] = raw.trim().replace(/^"|"$/g, "").replace(/""/g, '"');
      });
      return record;
    });
  };

  const formatDate = (input: string) => {
    const parts = input.split(/[\/\-]/).map((p) => p.trim());
    if (parts.length !== 3) return "";
    const [m, d, y] = parts;
    if (!m || !d || !y) return "";
    return `${y.padStart(4, "0")}-${m.padStart(2, "0")}-${d.padStart(2, "0")}`;
  };

  const mapType = (t: string): CalendarType => {
    const type = t.trim().toLowerCase();
    switch (type) {
      case "band":
        return "Band";
      case "drama":
        return "Drama";
      case "fundraising":
      case "fundraiser":
        return "Fundraising";
      default:
        return "General";
    }
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setImporting(true);
    try {
      const text = await file.text();
      const rows = parseCsv(text);
      if (!rows.length) {
        toast.error("CSV is empty");
        return;
      }
      const events = rows
        .map((r) => ({
          title: r["title"],
          date: formatDate(r["date"]),
          calendar: mapType(r["type of event"] ?? r["type"] ?? r["calendar"] ?? ""),
          location: r["location"] || null,
          description: r["description"] || null,
          published: true,
        }))
        .filter((ev) => ev.title && ev.date);
      if (events.length === 0) {
        toast.error("No valid rows found");
        return;
      }
      const { error } = await (supabase as any).from("events").insert(events);
      if (error) {
        toast.error("Import failed", { description: error.message });
      } else {
        toast.success(`Imported ${events.length} events`);
        load();
      }
    } catch (err: any) {
      toast.error("Import failed", { description: err.message });
    } finally {
      setImporting(false);
      e.target.value = "";
    }
  };

  const create = async () => {
    if (!draft.title || !draft.date) {
      toast.error("Title and date are required");
      return;
    }
    setCreating(true);
    const { error } = await (supabase as any).from("events").insert(draft as any);
    setCreating(false);
    if (error) {
      toast.error("Create failed", { description: error.message });
    } else {
      toast.success("Event added");
      setDraft({ title: "", date: new Date().toISOString().slice(0, 10), calendar: "General", location: "", description: "", published: true });
      load();
    }
  };

  const save = async (row: EventRow) => {
    setSavingId(row.id);
    const { error } = await (supabase as any)
      .from("events")
      .update({
        title: row.title,
        date: row.date,
        calendar: row.calendar,
        location: row.location,
        description: row.description,
        published: row.published,
      })
      .eq("id", row.id);
    setSavingId(null);
    if (error) {
      toast.error("Save failed", { description: error.message });
    } else {
      toast.success("Saved");
      load();
    }
  };

  const remove = async (id: string) => {
    if (!confirm("Delete this event?")) return;
    const { error } = await (supabase as any).from("events").delete().eq("id", id);
    if (error) {
      toast.error("Delete failed", { description: error.message });
    } else {
      toast.success("Deleted");
      setItems((prev) => prev.filter((i) => i.id !== id));
    }
  };

  return (
    <Card>
      <CardContent className="p-4 space-y-4">
        <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
          <div>
            <h3 className="font-semibold">Manage Events</h3>
            <p className="text-sm text-muted-foreground">Add, edit, publish, and reorder by date.</p>
          </div>
          <div>
            <input
              ref={fileInputRef}
              type="file"
              accept=".csv"
              onChange={handleFileChange}
              className="hidden"
            />
            <Button variant="outline" onClick={() => fileInputRef.current?.click()} disabled={importing}>
              {importing ? "Importing…" : "Import CSV"}
            </Button>
          </div>
        </div>

        {/* Create new */}
        <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 items-end">
          <Input
            placeholder="Title"
            value={draft.title}
            onChange={(e) => setDraft({ ...draft, title: e.target.value })}
          />
          <Input
            type="date"
            value={draft.date}
            onChange={(e) => setDraft({ ...draft, date: e.target.value })}
          />
          <select
            className="h-9 rounded-md border border-input bg-background px-3 text-sm"
            value={draft.calendar}
            onChange={(e) => setDraft({ ...draft, calendar: e.target.value as CalendarType })}
            aria-label="Calendar"
          >
            {CALENDARS.map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
          <Input
            placeholder="Location (optional)"
            value={draft.location ?? ""}
            onChange={(e) => setDraft({ ...draft, location: e.target.value })}
          />
          <Input
            placeholder="Description (optional)"
            value={draft.description ?? ""}
            onChange={(e) => setDraft({ ...draft, description: e.target.value })}
          />
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <Switch
                checked={draft.published}
                onCheckedChange={(v) => setDraft({ ...draft, published: v })}
                aria-label="Published"
              />
              <span className="text-sm">Published</span>
            </div>
            <Button onClick={create} disabled={creating}>
              {creating ? "Adding…" : "Add"}
            </Button>
          </div>
        </div>

        <div className="border-t border-border pt-4" />

        {/* List */}
        {loading ? (
          <div className="text-sm text-muted-foreground">Loading…</div>
        ) : items.length === 0 ? (
          <div className="text-sm text-muted-foreground">No events yet.</div>
        ) : (
          <div className="space-y-3">
            {items.map((row) => (
              <div key={row.id} className="grid gap-3 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 items-start">
                <Input
                  value={row.title}
                  onChange={(e) =>
                    setItems((prev) => prev.map((it) => (it.id === row.id ? { ...it, title: e.target.value } : it)))
                  }
                />
                <Input
                  type="date"
                  value={row.date}
                  onChange={(e) =>
                    setItems((prev) => prev.map((it) => (it.id === row.id ? { ...it, date: e.target.value } : it)))
                  }
                />
                <select
                  className="h-9 rounded-md border border-input bg-background px-3 text-sm"
                  value={row.calendar}
                  onChange={(e) =>
                    setItems((prev) => prev.map((it) => (it.id === row.id ? { ...it, calendar: e.target.value as CalendarType } : it)))
                  }
                  aria-label={`Calendar for ${row.title}`}
                >
                  {CALENDARS.map((c) => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
                <Input
                  value={row.location ?? ""}
                  onChange={(e) =>
                    setItems((prev) => prev.map((it) => (it.id === row.id ? { ...it, location: e.target.value } : it)))
                  }
                  placeholder="Location"
                />
                <Input
                  value={row.description ?? ""}
                  onChange={(e) =>
                    setItems((prev) => prev.map((it) => (it.id === row.id ? { ...it, description: e.target.value } : it)))
                  }
                  placeholder="Description"
                />
                <div className="flex items-center gap-2">
                  <Switch
                    checked={row.published}
                    onCheckedChange={(v) =>
                      setItems((prev) => prev.map((it) => (it.id === row.id ? { ...it, published: v } : it)))
                    }
                    aria-label={`Toggle publish for ${row.title}`}
                  />
                  <span className="text-sm">Published</span>
                </div>
                <div className="flex items-center gap-2 justify-end">
                  <Button variant="outline" onClick={() => save(row)} disabled={savingId === row.id}>
                    {savingId === row.id ? "Saving…" : "Save"}
                  </Button>
                  <Button variant="destructive" onClick={() => remove(row.id)}>Delete</Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
