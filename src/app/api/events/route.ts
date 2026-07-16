import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getCurrentCreator } from "@/lib/current";

export const dynamic = "force-dynamic";

export async function GET() {
  const creator = await getCurrentCreator();
  const events = await prisma.event.findMany({
    where: { creatorId: creator.id },
    orderBy: { startAt: "asc" },
    include: { deal: true },
  });
  return NextResponse.json(events);
}

export async function POST(req: NextRequest) {
  const creator = await getCurrentCreator();
  const body = await req.json();
  const event = await prisma.event.create({
    data: {
      creatorId: creator.id,
      title: body.title || "New event",
      type: body.type || "general",
      location: body.location || null,
      startAt: body.startAt ? new Date(body.startAt) : new Date(),
      endAt: body.endAt ? new Date(body.endAt) : null,
      notes: body.notes || null,
      dealId: body.dealId || null,
    },
    include: { deal: true },
  });
  return NextResponse.json(event, { status: 201 });
}
