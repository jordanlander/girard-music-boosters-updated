interface Announcement { id: string; text: string }

interface Props {
  items: Announcement[];
}

export default function AnnouncementsBar({ items }: Props) {
  if (!items?.length) return null;
  return (
    <aside className="w-full border-y border-border bg-accent/30">
      <div className="container py-2 text-sm">
        <ul className="flex flex-wrap gap-4">
          {items.map((a) => (
            <li key={a.id} className="before:content-['•'] before:mr-2 before:text-muted-foreground">
              {a.text}
            </li>
          ))}
        </ul>
      </div>
    </aside>
  );
}
