"use client";

import { useEffect, useState } from "react";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from "recharts";
import { TrendingUp, Users, Activity, Lightbulb } from "lucide-react";
import { format } from "date-fns";
import { SectionHeader, StatCard, Spinner } from "@/components/ui";
import { api, fmtNumber, platformLabel } from "@/lib/ui";

const COLORS: Record<string, string> = {
  instagram: "#ec4899",
  tiktok: "#22d3ee",
  youtube: "#ef4444",
  x: "#94a3b8",
  linkedin: "#3b82f6",
};

export default function AnalyticsPage() {
  const [data, setData] = useState<any>(null);

  useEffect(() => {
    api("/api/analytics").then(setData).catch(() => {});
  }, []);

  if (!data) return <Spinner />;
  const { summary, perPlatform, series, platforms, insights } = data;

  const chartData = series.map((s: any) => ({ ...s, label: format(new Date(s.date), "MMM d") }));

  return (
    <div className="mx-auto max-w-6xl">
      <SectionHeader title="Analytics" subtitle="Growth, reach, and engagement across your platforms." />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <StatCard label="Total followers" value={fmtNumber(summary.totalFollowers)} icon={<Users size={18} />} accent="halo" />
        <StatCard
          label="30-day growth"
          value={`+${fmtNumber(summary.totalGrowth)}`}
          sub="net new followers"
          icon={<TrendingUp size={18} />}
          accent="emerald"
        />
        <StatCard label="Avg engagement" value={`${summary.avgEngagement}%`} icon={<Activity size={18} />} accent="cyan" />
      </div>

      {/* Follower growth area chart */}
      <div className="card mt-6 p-5">
        <h2 className="mb-4 font-semibold">Follower growth (30 days)</h2>
        <div className="h-72">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartData} margin={{ left: -10, right: 10, top: 10 }}>
              <defs>
                <linearGradient id="g" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#8b5cf6" stopOpacity={0.5} />
                  <stop offset="100%" stopColor="#8b5cf6" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#2a2a3d" />
              <XAxis dataKey="label" stroke="#8b8ba7" fontSize={11} tickLine={false} minTickGap={30} />
              <YAxis stroke="#8b8ba7" fontSize={11} tickLine={false} tickFormatter={(v) => fmtNumber(v)} />
              <Tooltip
                contentStyle={{ background: "var(--cardc)", border: "1px solid var(--linec)", borderRadius: 12, color: "var(--inkc)" }}
                formatter={(v: any) => [fmtNumber(v), "Followers"]}
              />
              <Area type="monotone" dataKey="followers" stroke="#8b5cf6" strokeWidth={2} fill="url(#g)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-3">
        {/* Per-platform breakdown */}
        <div className="card p-5 lg:col-span-2">
          <h2 className="mb-4 font-semibold">By platform</h2>
          <div className="space-y-4">
            {perPlatform.map((p: any) => (
              <div key={p.platform}>
                <div className="mb-1 flex items-center justify-between text-sm">
                  <span className="flex items-center gap-2 font-medium">
                    <span className="h-2.5 w-2.5 rounded-full" style={{ background: COLORS[p.platform] }} />
                    {platformLabel[p.platform]}
                  </span>
                  <span className="text-muted">
                    {fmtNumber(p.followers)} · <span className="text-emerald-300">+{p.growthPct.toFixed(1)}%</span> · {p.engagementRate}% eng
                  </span>
                </div>
                <div className="h-2 overflow-hidden rounded-full bg-surface-2">
                  <div
                    className="h-full rounded-full"
                    style={{
                      width: `${Math.min(100, (p.followers / summary.totalFollowers) * 100)}%`,
                      background: COLORS[p.platform],
                    }}
                  />
                </div>
              </div>
            ))}
          </div>

          <div className="mt-6 h-56">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData} margin={{ left: -10, right: 10, top: 10 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#2a2a3d" />
                <XAxis dataKey="label" stroke="#8b8ba7" fontSize={11} tickLine={false} minTickGap={30} />
                <YAxis stroke="#8b8ba7" fontSize={11} tickLine={false} tickFormatter={(v) => fmtNumber(v)} />
                <Tooltip
                  contentStyle={{ background: "var(--cardc)", border: "1px solid var(--linec)", borderRadius: 12, color: "var(--inkc)" }}
                  formatter={(v: any, n: any) => [fmtNumber(v), platformLabel[String(n).replace("_followers", "")]]}
                />
                {platforms.map((p: string) => (
                  <Line
                    key={p}
                    type="monotone"
                    dataKey={`${p}_followers`}
                    stroke={COLORS[p]}
                    strokeWidth={2}
                    dot={false}
                  />
                ))}
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Insights */}
        <div className="card p-5">
          <h2 className="mb-4 flex items-center gap-2 font-semibold">
            <Lightbulb size={16} className="text-amber-300" /> Halo insights
          </h2>
          <ul className="space-y-3">
            {insights.map((ins: string, i: number) => (
              <li key={i} className="rounded-xl border border-border bg-surface-2/40 p-3 text-sm text-muted">
                {ins}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
