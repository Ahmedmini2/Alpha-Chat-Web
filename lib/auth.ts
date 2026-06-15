import { createClient } from "@/lib/supabase/server";
import type { User } from "@supabase/supabase-js";

/** Returns the authenticated user (validated against Supabase), or null. */
export async function getUser(): Promise<User | null> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  return user;
}

/** A friendly display name from the user's profile/metadata, falling back to email. */
export function displayName(user: User | null): string {
  if (!user) return "Guest";
  const m = user.user_metadata || {};
  const full =
    m.full_name ||
    [m.first_name, m.last_name].filter(Boolean).join(" ") ||
    m.name;
  if (full) return String(full);
  return user.email?.split("@")[0] || "Agent";
}
