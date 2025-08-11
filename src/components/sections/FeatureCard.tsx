import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface Props {
  title: string;
  description?: string;
  image: { src: string; alt: string };
  cta?: { label: string; href: string };
}

export default function FeatureCard({ title, description, image, cta }: Props) {
  return (
    <Card className="overflow-hidden border-border">
      <div className="grid md:grid-cols-2">
        <div className="bg-muted flex items-center justify-center max-h-[360px]">
          <img
            src={image.src}
            alt={image.alt}
            loading="lazy"
            className="w-full h-full object-contain p-2"
          />
        </div>
        <CardContent className="p-6 flex flex-col justify-center gap-3">
          <h3 className="font-display text-2xl font-semibold">{title}</h3>
          {description && (
            <p className="text-muted-foreground">{description}</p>
          )}
          {cta && (
            <div>
              <a href={cta.href}>
                <Button>{cta.label}</Button>
              </a>
            </div>
          )}
        </CardContent>
      </div>
    </Card>
  );
}
