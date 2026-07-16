"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Sparkles,
  CalendarDays,
  BarChart3,
  Handshake,
  MessageCircle,
  Link2,
  Settings,
} from "lucide-react";

const nav = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/studio", label: "Content Studio", icon: Sparkles },
  { href: "/calendar", label: "Calendar", icon: CalendarDays },
  { href: "/analytics", label: "Analytics", icon: BarChart3 },
  { href: "/deals", label: "Deals & PR", icon: Handshake },
  { href: "/connections", label: "Connections", icon: Link2 },
  { href: "/chat", label: "Halo Chat", icon: MessageCircle },
  { href: "/settings", label: "Settings", icon: Settings },
];

export default function Sidebar() {
  const pathname = usePathname();
  return (
    <aside className="fixed inset-y-0 left-0 z-30 hidden w-64 flex-col border-r border-border bg-surface/60 backdrop-blur-md md:flex">
      <Link href="/dashboard" className="flex items-center gap-2.5 px-6 py-6">
        <span className="brand-mark" style={{ width: 32, height: 32 }} />
        <div>
          <div className="text-lg font-semibold leading-none">Halo</div>
          <div className="text-[11px] text-muted">creator assistant</div>
        </div>
      </Link>

      <nav className="flex-1 space-y-1 px-3 py-2">
        {nav.map((item) => {
          const active = pathname.startsWith(item.href);
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors ${
                active
                  ? "bg-halo-600/15 text-ink ring-1 ring-halo-500/40"
                  : "text-muted hover:bg-surface-2/60 hover:text-ink"
              }`}
            >
              <Icon size={18} className={active ? "text-halo-300" : ""} />
              {item.label}
            </Link>
          );
        })}
      </nav>

      <div className="px-4 py-4">
        <div className="rounded-xl border border-border bg-gradient-to-br from-halo-600/20 to-accent/10 p-4">
          <div className="text-sm font-medium">Grow with Halo</div>
          <p className="mt-1 text-xs text-muted">
            Plan content, track brand deals, and stay ahead of every deadline.
          </p>
        </div>
      </div>
    </aside>
  );
}
