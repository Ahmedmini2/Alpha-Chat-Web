"use client";

import { Building2 } from "lucide-react";
import type { ProjectListCard as ProjectListCardData } from "@/lib/types";
import { CardFrame, Carousel } from "./kit";
import { ProjectCard } from "./ProjectCard";

export function ProjectListCard({ card }: { card: ProjectListCardData }) {
  const items = card.items ?? [];
  if (items.length === 0) return null;

  const count = items.length;
  const eyebrow = `${count} ${count === 1 ? "PROPERTY" : "PROPERTIES"}`;

  return (
    <CardFrame icon={<Building2 className="h-4 w-4" />} title="Matching properties" eyebrow={eyebrow}>
      <Carousel>
        {items.map((p, i) => (
          <ProjectCard key={p?.id ?? i} project={p} />
        ))}
      </Carousel>

      {card.has_more && (
        <p className="mt-3 text-[12px] text-fg-subtle">
          <span className="text-accent-press">+ more available</span> — ask to see the next 5
        </p>
      )}
    </CardFrame>
  );
}
