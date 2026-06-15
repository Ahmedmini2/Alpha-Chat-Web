"use client";

import { SearchX } from "lucide-react";
import type { NoMatchSuggestionsCard as NoMatchSuggestionsCardData } from "@/lib/types";
import { CardFrame, Carousel } from "./kit";
import { ProjectCard } from "./ProjectCard";

/**
 * Shown when the user asked for a project we don't carry. We acknowledge the
 * miss gracefully and offer the closest projects we do hold — kept premium and
 * reassuring rather than apologetic.
 */
export function NoMatchSuggestionsCard({ card }: { card: NoMatchSuggestionsCardData }) {
  const items = (card.items ?? []).filter((p) => p && p.id != null);
  const query = (card.query ?? "").trim();

  return (
    <CardFrame
      icon={<SearchX className="h-4 w-4" />}
      eyebrow="No exact match"
      title={query ? `“${query}”` : "Closest matches"}
      accent={items.length > 0}
    >
      {items.length > 0 ? (
        <>
          <p className="mb-3 text-[13px] leading-relaxed text-fg-muted">
            We don’t have{" "}
            {query ? (
              <span className="font-medium text-fg">“{query}”</span>
            ) : (
              "that one"
            )}{" "}
            in our system yet — here are the closest projects we do carry.
          </p>
          <Carousel>
            {items.map((project) => (
              <ProjectCard key={project.id} project={project} />
            ))}
          </Carousel>
        </>
      ) : (
        <p className="text-[13px] leading-relaxed text-fg-muted">
          We don’t have{" "}
          {query ? (
            <span className="font-medium text-fg">“{query}”</span>
          ) : (
            "that one"
          )}{" "}
          in our system yet, and I couldn’t find a close alternative right now.
          Try a different project, developer, or area.
        </p>
      )}
    </CardFrame>
  );
}
