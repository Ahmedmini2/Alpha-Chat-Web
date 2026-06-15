"use client";

import type { Card } from "@/lib/types";
import { ProjectListCard } from "./ProjectListCard";
import { NoMatchSuggestionsCard } from "./NoMatchSuggestionsCard";
import { ProjectDetailCard } from "./ProjectDetailCard";
import { MarketCard } from "./MarketCard";
import { InvestmentAnalysisCard } from "./InvestmentAnalysisCard";
import { InvestmentComparisonCard } from "./InvestmentComparisonCard";
import { InvestmentMetricsCard } from "./InvestmentMetricsCard";
import { DeveloperCard } from "./DeveloperCard";
import { NearbyAmenitiesCard } from "./NearbyAmenitiesCard";
import { DocumentQuotesCard } from "./DocumentQuotesCard";
import { VideoJobCard } from "./VideoJobCard";
import { VideoStatusCard } from "./VideoStatusCard";
import { AvatarLooksCard } from "./AvatarLooksCard";
import { BrochureCard } from "./BrochureCard";
import { ComparisonPdfCard } from "./ComparisonPdfCard";

/**
 * Dispatches a backend card to its renderer. Each card component is self-contained
 * and lives in its own file, exported as a named export, accepting `{ card }`
 * typed to its specific union member. Unknown/forward-compat types render nothing.
 */
export function CardRenderer({ card }: { card: Card }) {
  switch (card.type) {
    case "project_list":
      return <ProjectListCard card={card} />;
    case "no_match_suggestions":
      return <NoMatchSuggestionsCard card={card} />;
    case "project_detail":
      return <ProjectDetailCard card={card} />;
    case "market_card":
      return <MarketCard card={card} />;
    case "investment_analysis":
      return <InvestmentAnalysisCard card={card} />;
    case "investment_comparison":
      return <InvestmentComparisonCard card={card} />;
    case "investment_metrics":
      return <InvestmentMetricsCard card={card} />;
    case "developer_card":
      return <DeveloperCard card={card} />;
    case "nearby_amenities":
      return <NearbyAmenitiesCard card={card} />;
    case "document_quotes":
      return <DocumentQuotesCard card={card} />;
    case "video_job":
      return <VideoJobCard card={card} />;
    case "video_status":
      return <VideoStatusCard card={card} />;
    case "avatar_looks":
      return <AvatarLooksCard card={card} />;
    case "brochure":
      return <BrochureCard card={card} />;
    case "comparison_pdf":
      return <ComparisonPdfCard card={card} />;
    default:
      // Forward-compatible: a card type the frontend doesn't know yet.
      return null;
  }
}
