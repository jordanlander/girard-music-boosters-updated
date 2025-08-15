import { useState } from "react";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface LeaderCardProps {
  name: string;
  role: string;
}

export default function LeaderCard({ name, role }: LeaderCardProps) {
  const [flipped, setFlipped] = useState(false);

  return (
    <div
      className="[perspective:1000px] cursor-pointer transition-transform duration-300 hover:-rotate-1 hover:scale-105"
      onClick={() => setFlipped((f) => !f)}
    >
      <Card
        className={cn(
          "relative h-32 w-full p-5 [transform-style:preserve-3d] transition-transform duration-700",
          flipped && "[transform:rotateY(180deg)]"
        )}
      >
        <div className="absolute inset-0 flex flex-col [backface-visibility:hidden]">
          <div className="text-xs uppercase tracking-wide text-muted-foreground">{role}</div>
          <div className="text-lg font-semibold mt-1">{name}</div>
        </div>
        <div className="absolute inset-0 flex items-center justify-center bg-primary text-primary-foreground text-center [transform:rotateY(180deg)] [backface-visibility:hidden]">
          <p className="text-sm">Thanks for supporting the boosters!</p>
        </div>
      </Card>
    </div>
  );
}

