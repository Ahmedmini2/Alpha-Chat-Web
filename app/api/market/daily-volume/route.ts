import { NextResponse } from "next/server";
import { getUser } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";

export const runtime = "nodejs";

const PAGE = 1000;
const TTL_MS = 30 * 60 * 1000; // 30 min — the number only changes once a day

// Warm-instance cache so repeated "new chat" opens don't re-sum the day.
let cache: { at: number; data: { date: string | null; total_aed: number | null; count: number } } | null = null;

/**
 * Total AED value of all DLD transactions for the most recent day with data.
 * Computed directly from Supabase (market_transactions is publicly readable and
 * PostgREST aggregates are disabled, so we cursor-paginate by id and sum).
 */
export async function GET() {
  const user = await getUser();
  if (!user) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  if (cache && Date.now() - cache.at < TTL_MS) {
    return NextResponse.json(cache.data);
  }

  try {
    const supabase = await createClient();

    // Latest day that has transaction data (fallback when yesterday isn't ingested).
    const { data: latest } = await supabase
      .from("market_transactions")
      .select("txn_date")
      .gt("price_aed", 0)
      .order("txn_date", { ascending: false })
      .limit(1)
      .maybeSingle();

    const day: string | undefined = latest?.txn_date;
    if (!day) {
      const empty = { date: null, total_aed: null, count: 0 };
      cache = { at: Date.now(), data: empty };
      return NextResponse.json(empty);
    }

    let total = 0;
    let count = 0;
    let lastId = 0;
    for (let page = 0; page < 60; page++) {
      const { data, error } = await supabase
        .from("market_transactions")
        .select("id, price_aed")
        .eq("txn_date", day)
        .gt("price_aed", 0)
        .gt("id", lastId)
        .order("id", { ascending: true })
        .limit(PAGE);
      if (error || !data || data.length === 0) break;
      for (const r of data) {
        total += Number(r.price_aed) || 0;
        lastId = Number(r.id);
      }
      count += data.length;
      if (data.length < PAGE) break;
    }

    const result = { date: day, total_aed: total, count };
    cache = { at: Date.now(), data: result };
    return NextResponse.json(result);
  } catch {
    return NextResponse.json({ date: null, total_aed: null, count: 0 });
  }
}
