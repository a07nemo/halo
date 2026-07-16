import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getCurrentCreator } from "@/lib/current";

export const dynamic = "force-dynamic";

export async function GET() {
  const creator = await getCurrentCreator();
  const now = new Date();

  const [deals, upcomingEvents, scheduledPosts, deliverables, latestMetrics] = await Promise.all([
    prisma.deal.findMany({ where: { creatorId: creator.id }, include: { deliverables: true } }),
    prisma.event.findMany({
      where: { creatorId: creator.id, startAt: { gte: now } },
      orderBy: { startAt: "asc" },
      take: 5,
      include: { deal: true },
    }),
    prisma.post.findMany({
      where: { creatorId: creator.id, status: "scheduled" },
      orderBy: { scheduledAt: "asc" },
      take: 5,
    }),
    prisma.deliverable.findMany({
      where: { deal: { creatorId: creator.id }, status: { not: "approved" } },
      include: { deal: true },
      orderBy: { dueDate: "asc" },
    }),
    prisma.metric.findMany({
      where: { creatorId: creator.id },
      orderBy: { date: "desc" },
      take: 60,
    }),
  ]);

  const activeDeals = deals.filter((d) => ["active", "negotiating"].includes(d.status));
  const pipelineValue = deals
    .filter((d) => !["archived", "paid"].includes(d.status))
    .reduce((s, d) => s + d.value, 0);

  // followers: latest per platform
  const latestByPlatform: Record<string, number> = {};
  for (const m of latestMetrics) {
    if (!(m.platform in latestByPlatform)) latestByPlatform[m.platform] = m.followers;
  }
  const followerTotal = Object.values(latestByPlatform).reduce((s, v) => s + v, 0);

  return NextResponse.json({
    creator,
    stats: {
      followerTotal,
      activeDeals: activeDeals.length,
      pipelineValue,
      openDeliverables: deliverables.length,
      scheduledPosts: scheduledPosts.length,
    },
    upcomingEvents,
    scheduledPosts,
    deliverables: deliverables.slice(0, 6),
  });
}
