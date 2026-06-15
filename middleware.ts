import { type NextRequest } from "next/server";
import { updateSession } from "@/lib/supabase/middleware";

export async function middleware(request: NextRequest) {
  return await updateSession(request);
}

export const config = {
  matcher: [
    // Run on pages only. API routes (app/api/*) self-protect and return JSON 401s,
    // so they're excluded here — a redirect would hand a fetch() HTML instead of an error.
    // Static assets and image files are also excluded.
    "/((?!api|_next/static|_next/image|favicon.svg|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
