import { redirect } from "next/navigation";
import { getUser, displayName } from "@/lib/auth";
import { listConversations } from "@/lib/askalpha";
import { ChatApp } from "@/components/chat/ChatApp";
import type { Conversation } from "@/lib/types";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const user = await getUser();
  if (!user) redirect("/login");

  // Best-effort initial history load; the client refetches and shows backend
  // errors gracefully if this fails (e.g. backend not running yet).
  let conversations: Conversation[] = [];
  let backendDown = false;
  try {
    conversations = await listConversations(user.id);
  } catch {
    backendDown = true;
  }

  return (
    <ChatApp
      initialConversations={conversations}
      backendDown={backendDown}
      user={{
        id: user.id,
        email: user.email ?? "",
        name: displayName(user),
      }}
    />
  );
}
