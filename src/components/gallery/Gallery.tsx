import { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogTitle,
} from "@/components/ui/dialog";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious, type CarouselApi } from "@/components/ui/carousel";
type ImageItem = { src: string; alt: string };

interface Props {
  images: ImageItem[];
}

export default function Gallery({ images }: Props) {
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState<ImageItem | null>(null);
  const [api, setApi] = useState<CarouselApi | null>(null);

  useEffect(() => {
    if (!api) return;
    const id = setInterval(() => api.scrollNext(), 3500);
    return () => clearInterval(id);
  }, [api]);

  const openImage = (img: ImageItem) => {
    setActive(img);
    setOpen(true);
  };

  return (
    <div>
      <Carousel
        opts={{ loop: true, align: "start" }}
        setApi={(embla) => setApi(embla)}
        className="mx-auto max-w-4xl animate-fade-in"
      >
        <CarouselContent>
          {images.map((img) => (
            <CarouselItem key={img.src}>
              <button
                onClick={() => openImage(img)}
                className="group w-full"
                aria-label={`Open image: ${img.alt}`}
              >
                <div className="bg-muted rounded-lg border border-border overflow-hidden">
                  <div className="w-full h-[260px] sm:h-[360px] md:h-[420px] flex items-center justify-center">
                    <img
                      src={img.src}
                      alt={img.alt}
                      loading="lazy"
                      className="max-h-full max-w-full object-contain"
                    />
                  </div>
                </div>
              </button>
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious className="hidden sm:inline-flex" />
        <CarouselNext className="hidden sm:inline-flex" />
      </Carousel>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-[900px]">
          <DialogTitle className="sr-only">Photo preview</DialogTitle>
          {active && (
            <img
              src={active.src}
              alt={active.alt}
              className="w-full h-auto rounded-md"
              loading="eager"
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
