import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getCurrentCreator } from "@/lib/current";
import { chat, aiEnabled } from "@/lib/ai";

export const dynamic = "force-dynamic";

export async function GET() {
  const creator = await getCurrentCreator();
  const messages = await prisma.chatMessage.findMany({
    where: { creatorId: creator.id },
    orderBy: { createdAt: "asc" },
  });
  return NextResponse.json({ messages, aiEnabled: aiEnabled() });
}

export async function POST(req: NextRequest) {
  const creator = await getCurrentCreator();
  const body = await req.json();
  const content = (body.content || "").trim();
  if (!content) return NextResponse.json({ error: "content required" }, { status: 400 });

  await prisma.chatMessage.create({
    data: { creatorId: creator.id, role: "user", content },
  });

  // Build context
  const now = new Date();
  const [deals, events, metrics, history] = await Promise.all([
    prisma.deal.findMany({ where: { creatorId: creator.id } }),
    prisma.event.findMany({ where: { creatorId: creator.id, startAt: { gte: now } } }),
    prisma.metric.findMany({ where: { creatorId: creator.id }, orderBy: { date: "desc" }, take: 30 }),
    prisma.chatMessage.findMany({
      where: { creatorId: creator.id },
      orderBy: { createdAt: "asc" },
      take: 20,
    }),
  ]);

  const latestByPlatform: Record<string, number> = {};
  for (const m of metrics) if (!(m.platform in latestByPlatform)) latestByPlatform[m.platform] = m.followers;
  const followerTotal = Object.values(latestByPlatform).reduce((s, v) => s + v, 0);

  const reply = await chat(
    history.map((m) => ({ role: m.role, content: m.content })),
    {
      creatorName: creator.name,
      niche: creator.niche,
      activeDeals: deals.filter((d) => ["active", "negotiating"].includes(d.status)).length,
      upcomingEvents: events.length,
      followerTotal,
    }
  );

  const saved = await prisma.chatMessage.create({
    data: { creatorId: creator.id, role: "assistant", content: reply },
  });

  return NextResponse.json({ message: saved, aiEnabled: aiEnabled() });
}
