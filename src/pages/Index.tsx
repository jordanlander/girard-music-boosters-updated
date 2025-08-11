import { useEffect, useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Calendar as CalendarIcon, Users, Heart } from "lucide-react";
import EventCard from "@/components/events/EventCard";
import { CategoryChip } from "@/components/events/CategoryChip";
import Gallery from "@/components/gallery/Gallery";
import FeatureCard from "@/components/sections/FeatureCard";
import AnnouncementsBar from "@/components/sections/AnnouncementsBar";
import SupportSection from "@/components/sections/SupportSection";
import DocsSection from "@/components/sections/DocsSection";
import ContactSection from "@/components/sections/ContactSection";
import SocialHighlight from "@/components/sections/SocialHighlight";
import type { CalendarType, EventItem } from "@/types/events";


const photos = [
  "/lovable-uploads/371dd2bf-833e-43e5-98be-4b62e2521b2a.png",
  "/lovable-uploads/0edb8d5e-6f68-449c-bd0e-a64425869f8f.png",
];

// Types moved to src/types/events
const initialEvents: EventItem[] = [
  { id: "1", title: "Booster Meeting", date: "2025-08-20", calendar: "General", location: "GHS Auditorium" },
  { id: "2", title: "Band Rehearsal", date: "2025-08-22", calendar: "Band", location: "Band Room" },
  { id: "3", title: "Drama Club Read-Through", date: "2025-08-25", calendar: "Drama", location: "Black Box" },
  { id: "4", title: "Car Wash Fundraiser", date: "2025-08-30", calendar: "Fundraising", location: "School Parking Lot" },
];

const announcements = [
  { id: "a1", text: "Welcome to the 2025 season: Shuffle!" },
  { id: "a2", text: "Booster Meeting Aug 20, 7:00 PM (GHS Auditorium)" },
  { id: "a3", text: "Car Wash Fundraiser Aug 30" },
];


const Index = () => {
  const [selected, setSelected] = useState<CalendarType[]>(["Band", "Drama", "Fundraising", "General"]);
  const [query, setQuery] = useState("");

  useEffect(() => {
    document.title = "Girard Music & Drama Boosters | Support the Arts";
    const desc = "Support Girard Music & Drama Boosters—events, performances, and ways to get involved.";
    const meta = document.querySelector('meta[name="description"]');
    if (meta) meta.setAttribute("content", desc);
    // Ensure canonical URL is set
    const existing = document.querySelector('link[rel="canonical"]') as HTMLLinkElement | null;
    const href = window.location.href;
    if (existing) {
      existing.href = href;
    } else {
      const link = document.createElement("link");
      link.setAttribute("rel", "canonical");
      link.setAttribute("href", href);
      document.head.appendChild(link);
    }
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
      <header className="border-b border-border sticky top-0 bg-background/80 backdrop-blur supports-[backdrop-filter]:bg-background/60 z-40">
        <div className="container flex items-center justify-between py-3">
          <a href="#top" className="flex items-center gap-3">
            <img src="/lovable-uploads/4dd1825b-a51e-4884-9527-cb64042a826c.png" alt="Yellowjacket logo" className="h-10 w-10" />
            <span className="font-display text-lg sm:text-xl">Girard Music & Drama Boosters</span>
          </a>
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
      
      <AnnouncementsBar items={announcements} />

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
            <div className="mt-8">
              <SocialHighlight facebookUrl="https://www.facebook.com/GirardMusicandDramaBoosters" />
            </div>
          </div>
        </section>

        {/* Featured */}
        <section id="featured" className="container py-12">
          <div className="mb-6">
            <h2 className="font-display text-2xl sm:text-3xl font-semibold">Featured</h2>
            <p className="text-muted-foreground">This season’s highlights.</p>
          </div>
          <div className="grid gap-6">
            <FeatureCard
              title="2025 Show: Shuffle"
              description="Catch the Yellowjacket Marching Band’s 2025 show — a high‑energy mix of hits."
              image={{ src: "/lovable-uploads/247cf6cb-e08a-4553-8660-470cb8641893.png", alt: "Shuffle 2025 show artwork" }}
              cta={{ label: "See Schedule", href: "#events" }}
            />
            <FeatureCard
              title="The Sound of the Swarm"
              description="Pride, tradition, and community support powering our students."
              image={{ src: "/lovable-uploads/3f36a754-30e7-43d4-977b-cd32fda71c06.png", alt: "The Sound of the Swarm graphic" }}
            />
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
              <CategoryChip
                key={cal}
                label={cal}
                active={selected.includes(cal)}
                onClick={() => toggle(cal)}
              />
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
              <EventCard key={e.id} event={e} />
            ))}
            {filtered.length === 0 && (
              <div className="col-span-full text-muted-foreground">No events match your filters.</div>
            )}
          </div>

        </section>

        <SupportSection />
        <DocsSection />

        {/* Gallery */}
        <section id="gallery" className="container py-12">
          <div className="mb-6">
            <h2 className="font-display text-2xl sm:text-3xl font-semibold">Photo Gallery</h2>
            <p className="text-muted-foreground">Highlights from our students and leaders.</p>
          </div>
          <Gallery
            images={[
              { src: "/lovable-uploads/247cf6cb-e08a-4553-8660-470cb8641893.png", alt: "Shuffle 2025 show artwork" },
              { src: "/lovable-uploads/3f36a754-30e7-43d4-977b-cd32fda71c06.png", alt: "The Sound of the Swarm graphic" },
              { src: "/lovable-uploads/020ff85b-0621-428d-a126-92df0f98e408.png", alt: "Yellowjacket Marching Band graphic with notes" },
              { src: "/lovable-uploads/7d40c3c7-41c9-4c63-8bd1-76d79f4d591e.png", alt: "Yellowjacket logo splatter graphic" },
              { src: "/lovable-uploads/4dd1825b-a51e-4884-9527-cb64042a826c.png", alt: "Yellowjacket circular logo" },
              { src: photos[0], alt: "Booster leaders and staff group photo" },
              { src: photos[1], alt: "Girard band kids group photo" },
            ]}
          />
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
                className="w-full h-auto"
              />
            </CardContent>
          </Card>
          <div className="mt-6 grid sm:grid-cols-2 gap-4">
            <ul className="space-y-2">
              <li><strong>Mike Abbey</strong> — President</li>
              <li><strong>Matthew LaFata</strong> — Vice President</li>
              <li><strong>Nancy Bottom</strong> — Treasurer</li>
            </ul>
            <ul className="space-y-2">
              <li><strong>Cheyelle Couse</strong> — Secretary</li>
              <li><strong>Joe Meka</strong> — Social Media</li>
            </ul>
          </div>
        </section>

        <ContactSection />
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
