"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { format } from "date-fns";
import { Users, Handshake, DollarSign, ListChecks, ArrowRight, Clock } from "lucide-react";
import { StatCard, SectionHeader, Spinner, EmptyState } from "@/components/ui";
import HaloGreeting from "@/components/HaloGreeting";
import {
  api,
  fmtMoney,
  fmtNumber,
  eventTypeColor,
  deliverableStatusColor,
  platformColor,
  platformLabel,
  titleCase,
} from "@/lib/ui";

export default function DashboardPage() {
  const [data, setData] = useState<any>(null);
  const router = useRouter();

  useEffect(() => {
    api("/api/dashboard")
      .then((d) => {
        if (d?.creator && d.creator.onboarded === false) {
          router.replace("/onboarding");
          return;
        }
        setData(d);
      })
      .catch(() => {});
  }, [router]);

  if (!data) return <Spinner />;
  const { creator, stats, upcomingEvents, scheduledPosts, deliverables } = data;

  return (
    <div className="mx-auto max-w-6xl">
      <SectionHeader
        title="Dashboard"
        subtitle="Your creator command center — content, deals, and what's next."
      />

      <HaloGreeting name={creator?.name || ""} stats={stats} />

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <StatCard label="Total followers" value={fmtNumber(stats.followerTotal)} icon={<Users size={18} />} accent="halo" />
        <StatCard label="Active deals" value={stats.activeDeals} icon={<Handshake size={18} />} accent="cyan" />
        <StatCard label="Pipeline value" value={fmtMoney(stats.pipelineValue)} icon={<DollarSign size={18} />} accent="emerald" />
        <StatCard label="Open deliverables" value={stats.openDeliverables} icon={<ListChecks size={18} />} accent="amber" />
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-2">
        {/* Upcoming events */}
        <div className="card p-5">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="font-semibold">Upcoming</h2>
            <Link href="/calendar" className="text-xs text-halo-300 hover:text-halo-200">
              Calendar →
            </Link>
          </div>
          {upcomingEvents.length === 0 ? (
            <p className="py-6 text-center text-sm text-muted">Nothing scheduled. Enjoy the calm.</p>
          ) : (
            <ul className="space-y-3">
              {upcomingEvents.map((e: any) => (
                <li key={e.id} className="flex items-center gap-3">
                  <div className={`flex h-11 w-11 flex-col items-center justify-center rounded-xl border text-center ${eventTypeColor[e.type] || eventTypeColor.general}`}>
                    <span className="text-[10px] uppercase leading-none">{format(new Date(e.startAt), "MMM")}</span>
                    <span className="text-sm font-semibold leading-none">{format(new Date(e.startAt), "d")}</span>
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="truncate text-sm font-medium">{e.title}</div>
                    <div className="text-xs text-muted">
                      {format(new Date(e.startAt), "EEE p")}
                      {e.deal ? ` · ${e.deal.brand}` : ""}
                    </div>
                  </div>
                  <span className="pill capitalize">{e.type}</span>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Deliverables due */}
        <div className="card p-5">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="font-semibold">Deliverables due</h2>
            <Link href="/deals" className="text-xs text-halo-300 hover:text-halo-200">
              Deals →
            </Link>
          </div>
          {deliverables.length === 0 ? (
            <p className="py-6 text-center text-sm text-muted">All caught up. 🎉</p>
          ) : (
            <ul className="space-y-3">
              {deliverables.map((d: any) => (
                <li key={d.id} className="flex items-center gap-3">
                  <Clock size={16} className="text-muted" />
                  <div className="min-w-0 flex-1">
                    <div className="truncate text-sm font-medium">{d.title}</div>
                    <div className="text-xs text-muted">
                      {d.deal?.brand}
                      {d.dueDate ? ` · due ${format(new Date(d.dueDate), "MMM d")}` : ""}
                    </div>
                  </div>
                  <span className={`pill ${deliverableStatusColor[d.status]}`}>{titleCase(d.status)}</span>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      {/* Scheduled posts */}
      <div className="card mt-6 p-5">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="font-semibold">Scheduled posts</h2>
          <Link href="/studio" className="btn-ghost text-xs">
            Create content <ArrowRight size={14} />
          </Link>
        </div>
        {scheduledPosts.length === 0 ? (
          <EmptyState title="No posts scheduled" subtitle="Head to the Content Studio to draft and schedule your next post." />
        ) : (
          <div className="grid gap-3 md:grid-cols-2">
            {scheduledPosts.map((p: any) => (
              <div key={p.id} className="rounded-xl border border-border bg-surface-2/40 p-4">
                <div className="mb-2 flex items-center justify-between">
                  <span className={`pill ${platformColor[p.platform]}`}>{platformLabel[p.platform]}</span>
                  {p.scheduledAt && (
                    <span className="text-xs text-muted">{format(new Date(p.scheduledAt), "MMM d, p")}</span>
                  )}
                </div>
                <div className="text-sm font-medium">{p.title}</div>
                <p className="mt-1 line-clamp-2 text-xs text-muted">{p.caption}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
