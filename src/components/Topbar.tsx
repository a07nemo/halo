"use client";

import { useEffect, useState } from "react";
import { signOut } from "next-auth/react";
import { api } from "@/lib/ui";
import { Zap, LogOut } from "lucide-react";

export default function Topbar() {
  const [creator, setCreator] = useState<any>(null);
  const [aiEnabled, setAiEnabled] = useState(false);

  useEffect(() => {
    api("/api/creator")
      .then((d) => {
        setCreator(d.creator);
        setAiEnabled(d.aiEnabled);
      })
      .catch(() => {});
  }, []);

  const initials =
    creator?.name
      ?.split(" ")
      .map((p: string) => p[0])
      .slice(0, 2)
      .join("") || "··";

  return (
    <header className="sticky top-0 z-20 flex items-center justify-between border-b border-border bg-bg/70 px-5 py-3 backdrop-blur-md md:px-8">
      <div className="md:hidden text-lg font-semibold">Halo</div>
      <div className="hidden md:block text-sm text-muted">
        {greeting()}, <span className="text-ink">{creator?.name?.split(" ")[0] || "there"}</span> 👋
      </div>

      <div className="flex items-center gap-3">
        <span
          className={`pill ${aiEnabled ? "bg-emerald-500/15 text-emerald-300" : "bg-amber-500/15 text-amber-300"}`}
          title={aiEnabled ? "Claude AI active" : "Demo mode — add ANTHROPIC_API_KEY to enable Claude"}
        >
          <Zap size={12} /> {aiEnabled ? "AI on" : "Demo mode"}
        </span>
        {creator && (
          <div className="flex items-center gap-2.5">
            <div className="text-right">
              <div className="text-sm font-medium leading-none">{creator.name}</div>
              <div className="text-xs text-muted">{creator.handle}</div>
            </div>
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-c1 to-c3 text-sm font-semibold text-white">
              {initials}
            </div>
            <button
              onClick={() => signOut({ callbackUrl: "/" })}
              title="Sign out"
              className="rounded-lg p-2 text-muted hover:bg-surface-2 hover:text-ink"
            >
              <LogOut size={16} />
            </button>
          </div>
        )}
      </div>
    </header>
  );
}

function greeting() {
  const h = new Date().getHours();
  if (h < 12) return "Good morning";
  if (h < 18) return "Good afternoon";
  return "Good evening";
}
