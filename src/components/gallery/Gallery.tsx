import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogTitle,
} from "@/components/ui/dialog";

type ImageItem = { src: string; alt: string };

interface Props {
  images: ImageItem[];
}

export default function Gallery({ images }: Props) {
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState<ImageItem | null>(null);

  const openImage = (img: ImageItem) => {
    setActive(img);
    setOpen(true);
  };

  return (
    <div>
      <div className="grid md:grid-cols-2 gap-4">
        {images.map((img) => (
          <button
            key={img.src}
            onClick={() => openImage(img)}
            className="group relative"
            aria-label={`Open image: ${img.alt}`}
          >
            <img
              src={img.src}
              alt={img.alt}
              loading="lazy"
              className="w-full h-full rounded-lg border border-border object-cover"
            />
          </button>
        ))}
      </div>

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
