import { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface Announcement { id: string; text: string }

interface Props {
  items: Announcement[];
}

export default function AnnouncementsBar({ items }: Props) {
  const [index, setIndex] = useState(0);

  const prev = () => setIndex((i) => (i - 1 + items.length) % items.length);
  const next = () => setIndex((i) => (i + 1) % items.length);

  useEffect(() => {
    if (items.length < 2) return;
    const timer = setInterval(() => setIndex((i) => (i + 1) % items.length), 5000);
    return () => clearInterval(timer);
  }, [items.length]);

  if (!items?.length) return null;

  return (
    <aside className="w-full border-y border-border bg-accent/30">
      <div className="container py-2 text-sm flex items-center gap-2">
        <button
          aria-label="Previous announcement"
          onClick={prev}
          className="p-1 rounded-full hover:bg-accent transition-all active:scale-95"
        >
          <ChevronLeft className="h-4 w-4" />
        </button>
        <div className="overflow-hidden flex-1">
          <ul
            className="flex transition-transform duration-500 ease-in-out"
            style={{ transform: `translateX(-${index * 100}%)` }}
          >
            {items.map((a) => (
              <li
                key={a.id}
                className="w-full shrink-0 text-center line-clamp-2 sm:whitespace-nowrap"
              >
                {a.text}
              </li>
            ))}
          </ul>
        </div>
        <button
          aria-label="Next announcement"
          onClick={next}
          className="p-1 rounded-full hover:bg-accent transition-all active:scale-95"
        >
          <ChevronRight className="h-4 w-4" />
        </button>
      </div>
    </aside>
  );
}
