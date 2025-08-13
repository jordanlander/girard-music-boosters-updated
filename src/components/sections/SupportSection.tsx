import { Button } from "@/components/ui/button";

interface SupportSectionProps {
  onDonateClick: () => void;
  onVolunteerClick: () => void;
}

export default function SupportSection({
  onDonateClick,
  onVolunteerClick,
}: SupportSectionProps) {
  return (
    <section className="container py-12">
      <div className="mb-6">
        <h2 className="font-display text-2xl sm:text-3xl font-semibold">Support the Boosters</h2>
        <p className="text-muted-foreground max-w-2xl">
          Your donations and volunteer time directly fund student experiences in
          music and theatre.
        </p>
      </div>
      <div className="flex flex-wrap gap-3">
        <Button asChild size="lg">
          <a href="#donate">Donate</a>
        </Button>
        <Button asChild size="lg" variant="secondary">
          <a href="#volunteer">Volunteer</a>
        </Button>
      </div>
    </section>
  );
}
