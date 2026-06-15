// ============================================================================
// Ask Alpha API contract — mirrors the FastAPI backend (ask-alpha-chat).
// Card shapes are derived from app/core/orchestrator.py::_build_cards and the
// individual tool handlers. Keep in sync with the backend.
// ============================================================================

// ---------------------------------------------------------------------------
// Core chat
// ---------------------------------------------------------------------------

export interface ChatRequestBody {
  message: string;
  conversation_id?: string | null;
  /** Injected server-side from the Supabase session — never sent by the browser. */
  user_id?: string | null;
  channel?: string;
}

export interface ChatResponse {
  reply: string;
  model: string;
  channel: string;
  conversation_id: string;
  message_id: number;
  cards: Card[];
}

export interface Conversation {
  id: string;
  user_id: string | null;
  title: string;
  project_id: number | null;
  created_at: string;
  updated_at: string;
}

export type Role = "user" | "assistant";

export interface ChatMessage {
  id: number;
  conversation_id: string;
  role: Role;
  content: string;
  cards: Card[] | null;
  created_at: string;
}

/** GET /v1/market/daily-volume — total DLD transaction value for the latest day. */
export interface DailyVolume {
  date: string | null;
  total_aed: number | null;
  count: number;
}

/** GET /v1/videos/{id} — used to poll a promo video until it finishes rendering. */
export interface VideoRecord {
  id: string;
  requested_by: string;
  project_id: number | null;
  status: string; // pending | processing | completed | failed
  video_url: string | null;
  thumbnail_url: string | null;
  error: string | null;
  created_at: string;
  completed_at: string | null;
}

// ---------------------------------------------------------------------------
// Shared domain shapes
// ---------------------------------------------------------------------------

/** Per-project unit-match summary, present only on search_units results. */
export interface MatchedUnits {
  count: number;
  min_price: number | null;
  max_price: number | null;
  bedrooms_min: number | null;
  bedrooms_max: number | null;
  size_min: number | null;
  size_max: number | null;
  unit_types: string[];
  currency: string | null;
}

export interface ProjectSummary {
  id: number;
  name: string;
  developer: string | null;
  city: string | null;
  region: string | null;
  district: string | null;
  country: string | null;
  sale_status: string | null;
  status: string | null;
  completion_quarter: string | null;
  min_price: number | null;
  max_price: number | null;
  currency: string | null;
  short_description: string | null;
  units_count: number | null;
  /** Project cover photo (included by the backend in list payloads). */
  cover_image_url?: string | null;
  /** Only on search_units results — the units that matched the query's filters. */
  matched_units?: MatchedUnits | null;
  /** Ranked-list additions: short verdict label + conviction (0–100, 0–1, or a label). */
  verdict?: string | null;
  conviction?: number | string | null;
}

/** A pillar value tolerated in any of the shapes the backend might emit. */
export type PillarValue =
  | string
  | number
  | { label?: string | null; note?: string | null; score?: number | null }
  | null;

/** A valuation tolerated as a single AED number or a low/mid/high range. */
export type Valuation =
  | number
  | { low?: number | null; mid?: number | null; high?: number | null }
  | null;

export interface UnitSummary {
  unit_type: string | null;
  bedrooms: number | null;
  bathrooms: number | null;
  size: number | null;
  price: number | null;
  currency: string | null;
  area_unit: string | null;
  layout_name: string | null;
  status: string | null;
}

export interface ProjectDetail extends ProjectSummary {
  description: string | null;
  amenities: unknown; // JSONB — string[] | {name|title}[] | null
  completion_date: string | null;
  post_handover: boolean | null;
  has_escrow: boolean | null;
  service_charge: string | null;
  furnishing: string | null;
  deposit_description: string | null;
  managing_company: string | null;
  brand: string | null;
  marketing_brochure_url: string | null;
  cover_image_url: string | null;
  units_summary: UnitSummary[];
}

export interface MarketData {
  found: boolean;
  query: string;
  matched_name: string | null;
  match_level: string | null;
  city: string | null;
  district: string | null;
  community: string | null;
  median_price_aed_12m: number | null;
  median_rate_aed_sqm_12m: number | null;
  median_rate_aed_sqft_12m: number | null;
  median_rate_aed_sqft_90d: number | null;
  rate_momentum_pct: number | null;
  activity_label: string | null; // hot | healthy | cooling | quiet
  pct_offplan_12m: number | null;
  txn_12m: number | null;
  txn_90d: number | null;
  txn_prev_90d: number | null;
  last_txn_date: string | null;
  summary: string;
  recent_comparables?: MarketComparable[];
}

export interface MarketComparable {
  txn_date: string | null;
  property_type: string | null;
  layout: string | null;
  size_sqft: number | null;
  price_aed: number | null;
  rate_aed_sqft: number | null;
  sale_type: string | null;
  building: string | null;
  project: string | null;
}

export interface InvestmentAnalysis {
  found?: boolean;
  project_id: number;
  name: string;
  developer: string | null;
  district: string | null;
  sale_status: string | null;
  completion_quarter: string | null;
  post_handover_plan: boolean | null;
  units_count: number | null;
  asking_rate_aed_sqft: number | null;
  median_unit_price_aed: number | null;
  dominant_unit_type: string | null;
  market: {
    matched_name: string | null;
    median_rate_aed_sqft_12m: number | null;
    rate_momentum_pct: number | null;
    activity_label: string | null;
    pct_offplan_12m: number | null;
    txn_12m: number | null;
  } | null;
  valuation_vs_market: string; // "above" | "below" | "in line with" area median | "unknown"
  premium_to_market_pct: number | null;
  rental_yield_estimate: {
    gross_yield_low_pct: number | null;
    gross_yield_high_pct: number | null;
    estimated_annual_rent_aed: { annual_low: number; annual_high: number } | null;
    basis: string;
  } | null;
  data_gaps: string[];
}

export interface InvestmentMetricsData {
  net_yield_pct: number | null;
  area_avg_rent_return_pct: number | null;
  annual_appreciation_pct: number | null;
  y5_projected_value_aed: number | null;
  five_year_gain_pct: number | null;
  time_to_sell_days: number | null;
  price_per_sqft_aed: number | null;
  vs_area_price_pct: number | null;
}

export interface DeveloperProfile {
  found?: boolean;
  developer_id: number;
  name: string;
  website: string | null;
  description: string | null;
  logo_s3_url: string | null;
  total_projects: number;
  on_sale: number;
  delivered: number;
  upcoming: number;
  on_time_delivery_pct: number | null;
  on_time_basis: string;
  districts_active: number;
  cities_active: number;
  price_range_aed: { from: number | null; to: number | null };
  notable_projects: Array<{
    id: number;
    name: string;
    district: string | null;
    sale_status: string | null;
    completion_quarter: string | null;
    min_price: number | null;
  }>;
}

export interface AmenitiesData {
  found: boolean;
  project_id: number;
  project_name: string;
  radius_m: number;
  categories: Record<string, Array<{ name: string; distance_m: number; lat: number; lng: number }>>;
  total: number;
  source: string;
}

export interface DocumentChunk {
  project_id: number | null;
  project_name: string | null;
  asset_id: number | null;
  source_kind: string;
  chunk_index: number;
  similarity: number;
  content: string;
}

// ---------------------------------------------------------------------------
// Cards — discriminated union on `type`
// ---------------------------------------------------------------------------

export interface ProjectListCard {
  type: "project_list";
  items: ProjectSummary[];
  has_more: boolean;
  next_offset: number | null;
}

export interface NoMatchSuggestionsCard {
  type: "no_match_suggestions";
  query: string | null;
  items: ProjectSummary[];
}

export interface ProjectDetailCard {
  type: "project_detail";
  project: ProjectDetail;
}

export interface MarketCard {
  type: "market_card";
  market: MarketData;
}

export interface InvestmentAnalysisCard {
  type: "investment_analysis";
  analysis: InvestmentAnalysis;
}

export interface InvestmentComparisonCard {
  type: "investment_comparison";
  items: InvestmentAnalysis[];
}

export interface InvestmentMetricsCard {
  type: "investment_metrics";
  project_id: number | null;
  project_name: string | null;
  community: string | null;
  inputs: { price_aed: number; beds: number | null; size_sqft: number | null } | null;
  metrics: InvestmentMetricsData | null;
  used_area_fallback: boolean | null;
  basis: string | null;
}

export interface DeveloperCard {
  type: "developer_card";
  developer: DeveloperProfile;
}

export interface NearbyAmenitiesCard {
  type: "nearby_amenities";
  amenities: AmenitiesData;
}

export interface DocumentQuotesCard {
  type: "document_quotes";
  items: DocumentChunk[];
}

export interface VideoJobCard {
  type: "video_job";
  video_id: string | null;
  status: string | null;
  project_id: number | null;
  project_name: string | null;
}

export interface AvatarLooksCard {
  type: "avatar_looks";
  agent_name: string | null;
  project_id: number | null;
  looks: Array<{ name: string; preview_url?: string | null }>;
  truncated: boolean;
  total_available: number | null;
  sent_to_telegram: boolean | null;
}

export interface BrochureCard {
  type: "brochure";
  status: string | null;
  project_id: number | null;
  project_name: string | null;
  pdf_url: string | null;
  filename: string | null;
  sent_to_telegram: boolean | null;
}

export interface ComparisonPdfCard {
  type: "comparison_pdf";
  status: string | null;
  project_names: string[] | null;
  alpha_scores: string[] | null;
  pdf_url: string | null;
  filename: string | null;
  sent_to_telegram: boolean | null;
}

export interface VideoStatusCard {
  type: "video_status";
  video_id: string | null;
  status: string | null;
  video_url: string | null;
  thumbnail_url: string | null;
  project_id: number | null;
  project_name: string | null;
  error_detail: string | null;
}

export interface AlphaVerdictCard {
  type: "alpha_verdict";
  verdict: string | null;
  conviction: number | string | null;
  pillars: {
    yield?: PillarValue;
    comp?: PillarValue;
    thesis?: PillarValue;
    risk?: PillarValue;
  } | null;
  numbers: {
    net_yield_pct?: number | null;
    area_rent_return_pct?: number | null;
    annual_appreciation_pct?: number | null;
    y5_value_aed?: number | null;
    ppsf_aed?: number | null;
    vs_area_price_pct?: number | null;
  } | null;
  community: string | null;
  used_fallback: boolean | null;
  basis: string | null;
  // Optional project linkage (rendered if present).
  project_id?: number | null;
  project_name?: string | null;
}

export interface LiveMarketCard {
  type: "live_market";
  valuation: Valuation;
  ppsf_aed: number | null;
  observed_yield_pct: number | null;
  sold: number | boolean | string | null;
  fetched_at: string | null;
  // Optional context (rendered if present).
  community?: string | null;
  project_name?: string | null;
  source?: string | null;
}

export type Card =
  | ProjectListCard
  | NoMatchSuggestionsCard
  | ProjectDetailCard
  | MarketCard
  | InvestmentAnalysisCard
  | InvestmentComparisonCard
  | InvestmentMetricsCard
  | DeveloperCard
  | NearbyAmenitiesCard
  | DocumentQuotesCard
  | VideoJobCard
  | AvatarLooksCard
  | BrochureCard
  | ComparisonPdfCard
  | VideoStatusCard
  | AlphaVerdictCard
  | LiveMarketCard;

export type CardType = Card["type"];

// A card that didn't match any known type (forward-compat). The renderer falls
// back gracefully on these.
export type UnknownCard = { type: string } & Record<string, unknown>;
