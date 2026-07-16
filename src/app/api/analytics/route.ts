import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getCurrentCreator } from "@/lib/current";

export const dynamic = "force-dynamic";

export async function GET() {
  const creator = await getCurrentCreator();
  const metrics = await prisma.metric.findMany({
    where: { creatorId: creator.id },
    orderBy: { date: "asc" },
  });

  const platforms = Array.from(new Set(metrics.map((m) => m.platform)));

  // Build a per-date series merged across platforms for charts
  const byDate: Record<string, any> = {};
  for (const m of metrics) {
    const key = m.date.toISOString().slice(0, 10);
    if (!byDate[key]) byDate[key] = { date: key, followers: 0, reach: 0, engagements: 0 };
    byDate[key].followers += m.followers;
    byDate[key].reach += m.reach;
    byDate[key].engagements += m.engagements;
    byDate[key][`${m.platform}_followers`] = m.followers;
  }
  const series = Object.values(byDate).sort((a: any, b: any) => a.date.localeCompare(b.date));

  // Per-platform latest + growth
  const perPlatform = platforms.map((p) => {
    const rows = metrics.filter((m) => m.platform === p);
    const first = rows[0];
    const last = rows[rows.length - 1];
    const engRate = last.reach ? (last.engagements / last.reach) * 100 : 0;
    return {
      platform: p,
      followers: last.followers,
      growth: last.followers - first.followers,
      growthPct: first.followers ? ((last.followers - first.followers) / first.followers) * 100 : 0,
      reach: last.reach,
      engagementRate: Number(engRate.toFixed(2)),
    };
  });

  const totalFollowers = perPlatform.reduce((s, p) => s + p.followers, 0);
  const totalGrowth = perPlatform.reduce((s, p) => s + p.growth, 0);
  const avgEngagement =
    perPlatform.reduce((s, p) => s + p.engagementRate, 0) / (perPlatform.length || 1);

  // Simple AI-style insights (rule-based, no key needed)
  const insights: string[] = [];
  const best = [...perPlatform].sort((a, b) => b.growthPct - a.growthPct)[0];
  const topEng = [...perPlatform].sort((a, b) => b.engagementRate - a.engagementRate)[0];
  if (best) insights.push(`${cap(best.platform)} is your fastest grower — +${best.growth.toLocaleString()} followers (${best.growthPct.toFixed(1)}%) in 30 days. Double down here.`);
  if (topEng) insights.push(`${cap(topEng.platform)} has your strongest engagement rate at ${topEng.engagementRate}%. Great place to seed brand deals.`);
  insights.push(`You're averaging ${avgEngagement.toFixed(1)}% engagement across platforms — ${avgEngagement > 5 ? "well above" : "around"} the typical creator benchmark.`);

  return NextResponse.json({
    summary: { totalFollowers, totalGrowth, avgEngagement: Number(avgEngagement.toFixed(2)) },
    perPlatform,
    series,
    platforms,
    insights,
  });
}

function cap(s: string) {
  return s.charAt(0).toUpperCase() + s.slice(1);
}
