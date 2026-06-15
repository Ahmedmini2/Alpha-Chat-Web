import { createServerClient, type CookieOptions } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

type CookieToSet = { name: string; value: string; options?: CookieOptions };

const PUBLIC_PATHS = ["/login", "/auth"];

/**
 * Refreshes the Supabase auth session on every request and guards routes.
 * Hardened so a missing config or transient auth error can never turn into a
 * MIDDLEWARE_INVOCATION_FAILED 500 — we fall through to the request instead.
 */
export async function updateSession(request: NextRequest) {
  let response = NextResponse.next({ request });

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  // If Supabase isn't configured on this host (env vars not set), don't crash the
  // whole site at the edge — let the request through. Pages/handlers surface a
  // clearer error than an opaque middleware 500.
  if (!supabaseUrl || !supabaseKey) {
    if (process.env.NODE_ENV !== "production") {
      console.warn("[middleware] Supabase env vars missing — skipping auth guard.");
    }
    return response;
  }

  try {
    const supabase = createServerClient(supabaseUrl, supabaseKey, {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet: CookieToSet[]) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
          response = NextResponse.next({ request });
          cookiesToSet.forEach(({ name, value, options }) =>
            response.cookies.set(name, value, options),
          );
        },
      },
    });

    // IMPORTANT: getUser() revalidates the token with Supabase (don't trust getSession here).
    const {
      data: { user },
    } = await supabase.auth.getUser();

    const path = request.nextUrl.pathname;
    const isPublic = PUBLIC_PATHS.some((p) => path === p || path.startsWith(p + "/"));

    if (!user && !isPublic) {
      const url = request.nextUrl.clone();
      url.pathname = "/login";
      url.searchParams.set("next", path);
      return NextResponse.redirect(url);
    }

    if (user && path === "/login") {
      const url = request.nextUrl.clone();
      url.pathname = "/";
      url.search = "";
      return NextResponse.redirect(url);
    }

    return response;
  } catch (err) {
    // Never let an auth/transport error become a 500 for the entire site.
    console.error("[middleware] auth check failed:", err);
    return response;
  }
}
