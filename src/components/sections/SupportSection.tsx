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
        <Button size="lg" onClick={onDonateClick}>
          Donate
        </Button>
        <Button size="lg" variant="secondary" onClick={onVolunteerClick}>
          Volunteer
        </Button>
      </div>
    </section>
  );
}
