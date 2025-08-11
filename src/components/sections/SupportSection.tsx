import { Button } from "@/components/ui/button";

export default function SupportSection() {
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
        <a href="#donate"><Button size="lg">Donate</Button></a>
        <a href="#volunteer"><Button size="lg" variant="secondary">Volunteer</Button></a>
      </div>
    </section>
  );
}
