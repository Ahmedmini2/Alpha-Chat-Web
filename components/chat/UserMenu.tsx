"use client";

import { useState, useRef, useEffect } from "react";
import { LogOut, ChevronDown } from "lucide-react";
import { cn } from "@/lib/cn";
import type { UserInfo } from "./ChatApp";

export function UserMenu({ user }: { user: UserInfo }) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function onDoc(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", onDoc);
    return () => document.removeEventListener("mousedown", onDoc);
  }, []);

  const initials = user.name
    .split(" ")
    .map((p) => p[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

  return (
    <div ref={ref} className="relative border-t border-white/10 p-3">
      {open && (
        <div className="absolute bottom-[68px] left-3 right-3 overflow-hidden rounded-lg border border-white/10 bg-green-900 shadow-lift">
          <form action="/auth/signout" method="post">
            <button
              type="submit"
              className="flex w-full items-center gap-2.5 px-3.5 py-2.5 text-left text-sm text-green-100 transition hover:bg-white/10"
            >
              <LogOut className="h-4 w-4 text-gold-400" />
              Sign out
            </button>
          </form>
        </div>
      )}

      <button
        onClick={() => setOpen((o) => !o)}
        className="flex w-full items-center gap-3 rounded-lg px-2 py-2 text-left transition hover:bg-white/8"
      >
        <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-gradient-to-br from-gold-400 to-gold-700 text-sm font-semibold text-green-900">
          {initials || "A"}
        </span>
        <span className="min-w-0 flex-1">
          <span className="block truncate text-[13px] font-medium text-cream">{user.name}</span>
          <span className="block truncate text-[11px] text-green-200/60">{user.email}</span>
        </span>
        <ChevronDown
          className={cn("h-4 w-4 text-green-300/70 transition", open && "rotate-180")}
        />
      </button>
    </div>
  );
}
