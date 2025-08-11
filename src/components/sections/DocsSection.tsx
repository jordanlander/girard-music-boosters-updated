import { Card } from "@/components/ui/card";

const links = [
  { label: "Uniform Guidelines (PDF)", href: "#" },
  { label: "Permission Slip", href: "#" },
  { label: "Fundraising Info", href: "#" },
  { label: "Volunteer Form", href: "#" },
];

export default function DocsSection() {
  return (
    <section className="container py-12">
      <div className="mb-6">
        <h2 className="font-display text-2xl sm:text-3xl font-semibold">Documents & Forms</h2>
        <p className="text-muted-foreground">Quick access to commonly requested documents.</p>
      </div>
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {links.map((l) => (
          <a key={l.label} href={l.href}>
            <Card className="p-4 hover:bg-accent transition-colors">
              <span>{l.label}</span>
            </Card>
          </a>
        ))}
      </div>
    </section>
  );
}
