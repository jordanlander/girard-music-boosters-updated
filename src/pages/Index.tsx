import { useEffect, useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Calendar as CalendarIcon, Users, Heart } from "lucide-react";

const photos = [
  "/lovable-uploads/371dd2bf-833e-43e5-98be-4b62e2521b2a.png",
  "/lovable-uploads/0edb8d5e-6f68-449c-bd0e-a64425869f8f.png",
];

type CalendarType = "Band" | "Drama" | "Fundraising" | "General";

type EventItem = {
  id: string;
  title: string;
  date: string; // ISO date
  calendar: CalendarType;
  location?: string;
};

const initialEvents: EventItem[] = [
  { id: "1", title: "Booster Meeting", date: "2025-08-20", calendar: "General", location: "GHS Auditorium" },
  { id: "2", title: "Band Rehearsal", date: "2025-08-22", calendar: "Band", location: "Band Room" },
  { id: "3", title: "Drama Club Read-Through", date: "2025-08-25", calendar: "Drama", location: "Black Box" },
  { id: "4", title: "Car Wash Fundraiser", date: "2025-08-30", calendar: "Fundraising", location: "School Parking Lot" },
];

const Index = () => {
  const [selected, setSelected] = useState<CalendarType[]>(["Band", "Drama", "Fundraising", "General"]);
  const [query, setQuery] = useState("");

  useEffect(() => {
    document.title = "Girard Music & Drama Boosters | Support the Arts";
    const desc = "Support Girard Music & Drama Boosters—events, performances, and ways to get involved.";
    const meta = document.querySelector('meta[name="description"]');
    if (meta) meta.setAttribute("content", desc);
  }, []);

  const filtered = useMemo(() => {
    return initialEvents.filter((e) =>
      selected.includes(e.calendar) && e.title.toLowerCase().includes(query.toLowerCase())
    );
  }, [selected, query]);

  const toggle = (cal: CalendarType) => {
    setSelected((prev) =>
      prev.includes(cal) ? prev.filter((c) => c !== cal) : [...prev, cal]
    );
  };

  const orgJsonLd = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "Girard Music & Drama Boosters",
    url: typeof window !== "undefined" ? window.location.origin : "/",
  } as const;

  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="border-b border-border">
        <div className="container flex items-center justify-between py-4">
          <a href="#top" className="font-display text-xl sm:text-2xl">Girard Music & Drama Boosters</a>
          <nav className="hidden md:flex gap-4">
            <a href="#events" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Events</a>
            <a href="#gallery" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Gallery</a>
            <a href="#leaders" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Leaders</a>
          </nav>
          <div className="flex gap-2">
            <Button variant="secondary" className="hidden sm:inline-flex"><Users className="h-4 w-4 mr-2" />Join</Button>
            <Button><Heart className="h-4 w-4 mr-2" />Donate</Button>
          </div>
        </div>
      </header>

      <main id="top">
        {/* Hero */}
        <section className="relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-b from-primary/10 via-accent/10 to-background" aria-hidden="true" />
          <div className="container relative py-16 sm:py-24">
            <h1 className="font-display text-4xl sm:text-5xl md:text-6xl font-bold max-w-3xl">
              Girard Music & Drama Boosters
            </h1>
            <p className="mt-4 text-lg text-muted-foreground max-w-2xl">
              Championing music and theatre education through community support, events, and volunteering.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <a href="#events"><Button><CalendarIcon className="h-4 w-4 mr-2" />View Events</Button></a>
              <Button variant="secondary"><Users className="h-4 w-4 mr-2" />Get Involved</Button>
            </div>
          </div>
        </section>

        {/* Events Hub (basic v1) */}
        <section id="events" className="container py-12">
          <div className="mb-6">
            <h2 className="font-display text-2xl sm:text-3xl font-semibold">Upcoming Events</h2>
            <p className="text-muted-foreground">Filter by calendar and search.</p>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            {(["Band", "Drama", "Fundraising", "General"] as CalendarType[]).map((cal) => (
              <button
                key={cal}
                onClick={() => toggle(cal)}
                className={`px-3 py-1 rounded-full text-sm border transition-colors ${
                  selected.includes(cal)
                    ? "bg-primary text-primary-foreground border-transparent"
                    : "bg-background text-foreground border-border hover:bg-muted"
                }`}
                aria-pressed={selected.includes(cal)}
              >
                {cal}
              </button>
            ))}
            <input
              aria-label="Search events"
              placeholder="Search events..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="ml-auto w-full sm:w-64 rounded-md border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
            />
          </div>

          <div className="mt-6 grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {filtered.map((e) => (
              <Card key={e.id} className="border-border">
                <CardContent className="p-4">
                  <div className="text-sm text-muted-foreground">{new Date(e.date).toLocaleDateString()}</div>
                  <div className="mt-1 font-medium">{e.title}</div>
                  {e.location && (
                    <div className="text-sm text-muted-foreground">{e.location}</div>
                  )}
                  <div className="mt-3 text-xs text-muted-foreground">{e.calendar}</div>
                </CardContent>
              </Card>
            ))}
            {filtered.length === 0 && (
              <div className="col-span-full text-muted-foreground">No events match your filters.</div>
            )}
          </div>
        </section>

        {/* Gallery */}
        <section id="gallery" className="container py-12">
          <div className="mb-6">
            <h2 className="font-display text-2xl sm:text-3xl font-semibold">Photo Gallery</h2>
            <p className="text-muted-foreground">Highlights from our students and leaders.</p>
          </div>
          <div className="grid md:grid-cols-2 gap-4">
            {photos.map((src, i) => (
              <img
                key={src}
                src={src}
                alt={i === 0 ? "Booster leaders and staff group photo" : "Girard band kids group photo"}
                loading="lazy"
                className="w-full h-full rounded-lg border border-border object-cover"
              />)
            )}
          </div>
        </section>

        {/* Leaders & Staff */}
        <section id="leaders" className="container py-12">
          <div className="mb-6">
            <h2 className="font-display text-2xl sm:text-3xl font-semibold">Leaders & Staff</h2>
            <p className="text-muted-foreground max-w-2xl">Our adult leaders and staff support students across band and drama programs, coordinating events, fundraising, and logistics.</p>
          </div>
          <Card className="overflow-hidden">
            <CardContent className="p-0">
              <img
                src={photos[0]}
                alt="Boosters adult leaders standing together outdoors"
                loading="lazy"
                className="w-full object-cover max-h-[420px]"
              />
            </CardContent>
          </Card>
        </section>
      </main>

      <footer className="border-t border-border">
        <div className="container py-8 text-sm text-muted-foreground">
          <div>© {new Date().getFullYear()} Girard Music & Drama Boosters</div>
          <div className="mt-2">Community support that makes the arts possible.</div>
        </div>
      </footer>

      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(orgJsonLd) }} />
    </div>
  );
};

export default Index;
