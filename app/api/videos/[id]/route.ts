import { NextResponse } from "next/server";
import { getUser } from "@/lib/auth";
import { getVideo, AskAlphaError } from "@/lib/askalpha";

export const runtime = "nodejs";

// Poll target for promo-video status. Lets the video card auto-update to the
// finished player without the user asking "is it ready?".
export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const user = await getUser();
  if (!user) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  const { id } = await params;

  try {
    const video = await getVideo(id);
    // Ownership check: only the requester can poll their video.
    if (video.requested_by && video.requested_by !== user.id) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }
    return NextResponse.json(video);
  } catch (err) {
    const status = err instanceof AskAlphaError ? err.status : 500;
    const msg = err instanceof Error ? err.message : "Failed to load video";
    return NextResponse.json({ error: msg }, { status });
  }
}
