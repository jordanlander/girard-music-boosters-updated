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
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";


const Index = () => {
  const baseUrl = import.meta.env.BASE_URL;
  const [selected, setSelected] = useState<CalendarType[]>(["Band", "Drama", "Fundraising", "General"]);
  const [query, setQuery] = useState("");
  const [galleryImages, setGalleryImages] = useState<{ src: string; alt: string }[]>([]);
  const [events, setEvents] = useState<EventItem[]>([]);
  const [joinOpen, setJoinOpen] = useState(false);
  const [donateOpen, setDonateOpen] = useState(false);
  const [joinName, setJoinName] = useState("");
  const [joinEmail, setJoinEmail] = useState("");
  const [joinNotes, setJoinNotes] = useState("");
  const [joinLoading, setJoinLoading] = useState(false);

  const announcements = useMemo(() => {
    const eventAnnouncements = events.map((e) => {
      const date = new Date(e.date);
      const dateStr = date.toLocaleDateString(undefined, {
        weekday: "short",
        month: "short",
        day: "numeric",
      });
      return { id: e.id, text: `${dateStr}: ${e.title}` };
    });
    return [
      { id: "season", text: "Welcome to the 2025 season: Shuffle!" },
      ...eventAnnouncements,
    ];
  }, [events]);

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

  // Load events from Supabase (published only)
  useEffect(() => {
    (async () => {
      const { data, error } = await (supabase as any)
        .from("events")
        .select("id,title,date,calendar,location,description")
        .eq("published", true)
        .order("date", { ascending: true });
      if (!error && data) {
        setEvents(
          (data as any[]).map((d) => ({
            id: d.id,
            title: d.title,
            date: d.date,
            calendar: d.calendar as CalendarType,
            location: d.location ?? undefined,
            description: d.description ?? undefined,
          }))
        );
      }
    })();
  }, []);

  // Load gallery photos from Supabase storage via photos table
  useEffect(() => {
    (async () => {
      const { data, error } = await (supabase as any)
        .from("photos")
        .select("path,alt,order_index,published,created_at")
        .eq("published", true)
        .order("order_index", { ascending: true })
        .order("created_at", { ascending: true });
      if (!error && data) {
        const mapped = (data as any[]).map((p) => {
          const { data: pub } = (supabase as any).storage.from("gallery").getPublicUrl(p.path);
          return { src: pub.publicUrl as string, alt: p.alt || "Gallery image" };
        });
        setGalleryImages(mapped);
      }
    })();
  }, []);

  const filtered = useMemo(() => {
    return events.filter((e) =>
      selected.includes(e.calendar) && e.title.toLowerCase().includes(query.toLowerCase())
    );
  }, [events, selected, query]);

  const toggle = (cal: CalendarType) => {
    setSelected((prev) =>
      prev.includes(cal) ? prev.filter((c) => c !== cal) : [...prev, cal]
    );
  };

  const handleJoinSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!joinName || !joinEmail) {
      toast.error("Please enter your name and email.");
      return;
    }
    setJoinLoading(true);
    const { data, error } = await (supabase as any).functions.invoke("join-request", {
      body: { name: joinName, email: joinEmail, message: joinNotes },
    });
    setJoinLoading(false);
    if (error) {
      toast.error("Could not send message", { description: error.message });
    } else {
      toast.success("Thanks! We'll be in touch soon.");
      setJoinOpen(false);
      setJoinName("");
      setJoinEmail("");
      setJoinNotes("");
    }
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
            <img src={`${baseUrl}lovable-uploads/4dd1825b-a51e-4884-9527-cb64042a826c.png`} alt="Yellowjacket logo" className="h-10 w-10" />
            <span className="font-display text-lg sm:text-xl">Girard Music & Drama Boosters</span>
          </a>
          <nav className="hidden md:flex gap-4">
            <a href="#events" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Events</a>
            <a href="#gallery" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Gallery</a>
            <a href="#leaders" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Leaders</a>
          </nav>
          <div className="flex gap-2">
            <Button variant="secondary" onClick={() => setJoinOpen(true)}><Users className="h-4 w-4 mr-2" />Join</Button>
            <Button onClick={() => setDonateOpen(true)}><Heart className="h-4 w-4 mr-2" />Donate</Button>
          </div>
        </div>
      </header>
      
      <AnnouncementsBar items={announcements} />

      <main id="top">
        {/* Hero */}
        <section className="relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-b from-primary/10 via-accent/10 to-background" aria-hidden="true" />
          <div className="container relative py-16 sm:py-24 flex flex-col items-center text-center">
            <h1 className="font-display text-4xl sm:text-5xl md:text-6xl font-bold max-w-3xl mx-auto">
              Girard Music & Drama Boosters
            </h1>
            <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">
              Championing music and theatre education through community support, events, and volunteering.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <a href="#events"><Button><CalendarIcon className="h-4 w-4 mr-2" />View Events</Button></a>
              <Button variant="secondary" onClick={() => setJoinOpen(true)}><Users className="h-4 w-4 mr-2" />Get Involved</Button>
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
              image={{ src: `${baseUrl}lovable-uploads/247cf6cb-e08a-4553-8660-470cb8641893.png`, alt: "Shuffle 2025 show artwork" }}
              cta={{ label: "See Schedule", href: "#events" }}
            />
            <FeatureCard
              title="The Sound of the Swarm"
              description="Pride, tradition, and community support powering our students."
              image={{ src: `${baseUrl}lovable-uploads/3f36a754-30e7-43d4-977b-cd32fda71c06.png`, alt: "The Sound of the Swarm graphic" }}
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
        <SupportSection
          onDonateClick={() => setDonateOpen(true)}
          onVolunteerClick={() => setJoinOpen(true)}
        />
        <DocsSection />

        {/* Gallery */}
        <section id="gallery" className="container py-12">
          <div className="mb-6">
            <h2 className="font-display text-2xl sm:text-3xl font-semibold">Photo Gallery</h2>
            <p className="text-muted-foreground">Highlights from our students and leaders.</p>
          </div>
          <Gallery
            images={galleryImages}
          />
        </section>

        {/* Leaders & Staff */}
        <section id="leaders" className="container py-12">
          <div className="mb-6">
            <h2 className="font-display text-2xl sm:text-3xl font-semibold">Leaders & Staff</h2>
            <p className="text-muted-foreground max-w-2xl">Our adult leaders and staff support students across band and drama programs, coordinating events, fundraising, and logistics.</p>
          </div>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {[
              { name: "Mike Abbey", role: "President" },
              { name: "Matthew LaFata", role: "Vice President" },
              { name: "Nancy Bottom", role: "Treasurer" },
              { name: "Cheyelle Couse", role: "Secretary" },
              { name: "Joe Meka", role: "Social Media" },
            ].map((p) => (
              <Card key={p.name} className="p-5 animate-fade-in hover-scale">
                <div className="text-xs uppercase tracking-wide text-muted-foreground">{p.role}</div>
                <div className="text-lg font-semibold mt-1">{p.name}</div>
              </Card>
            ))}
          </div>
        </section>

        <ContactSection />
      </main>

      {/* Join Dialog */}
      <Dialog open={joinOpen} onOpenChange={setJoinOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Join the Boosters</DialogTitle>
            <DialogDescription>Tell us how to reach you and we’ll get in touch.</DialogDescription>
          </DialogHeader>
          <form onSubmit={handleJoinSubmit} className="space-y-3">
            <div className="grid gap-2">
              <Label htmlFor="join-name">Name</Label>
              <Input id="join-name" value={joinName} onChange={(e) => setJoinName(e.target.value)} required />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="join-email">Email</Label>
              <Input id="join-email" type="email" value={joinEmail} onChange={(e) => setJoinEmail(e.target.value)} required />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="join-notes">Notes (optional)</Label>
              <Textarea id="join-notes" value={joinNotes} onChange={(e) => setJoinNotes(e.target.value)} rows={4} />
            </div>
            <DialogFooter className="gap-2">
              <Button type="button" variant="outline" onClick={() => setJoinOpen(false)}>Cancel</Button>
              <Button type="submit" disabled={joinLoading}>{joinLoading ? "Sending…" : "Send"}</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Donate Dialog */}
      <Dialog open={donateOpen} onOpenChange={setDonateOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Donate by Check</DialogTitle>
            <DialogDescription>Until online donations are enabled, please mail a check.</DialogDescription>
          </DialogHeader>
          <div className="space-y-2 text-sm">
            <p>Make checks payable to: <strong>Girard Music Boosters</strong></p>
            <p>Mailing Address:</p>
            <address className="not-italic text-muted-foreground">
              P.O. Box 425<br />
              Girard, PA 16417
            </address>
            <p className="text-muted-foreground">Questions? Email <a className="underline" href="mailto:girardmusicboosters@gmail.com">girardmusicboosters@gmail.com</a></p>
          </div>
          <DialogFooter>
            <Button onClick={() => setDonateOpen(false)}>Done</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>


      <footer className="border-t border-border">
        <div className="container py-8 text-sm text-muted-foreground flex items-center justify-between gap-2">
          <div>
            <div>© {new Date().getFullYear()} Girard Music & Drama Boosters</div>
            <div className="mt-2">Community support that makes the arts possible.</div>
          </div>
          <Button variant="link" size="sm" asChild>
            <Link to="/admin" aria-label="Admin login">Login</Link>
          </Button>
        </div>
      </footer>

      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(orgJsonLd) }} />
    </div>
  );
};

export default Index;
