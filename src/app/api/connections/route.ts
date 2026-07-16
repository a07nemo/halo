import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getCurrentCreator } from "@/lib/current";

export const dynamic = "force-dynamic";

const SUPPORTED = ["instagram", "tiktok", "youtube", "x"];

export async function GET() {
  const creator = await getCurrentCreator();
  const connections = await prisma.connection.findMany({
    where: { creatorId: creator.id },
  });
  return NextResponse.json(connections);
}

// Mock/sandbox "OAuth": connecting instantly links the account and
// generates plausible follower numbers. Swap this for a real OAuth
// callback per platform when developer credentials are ready.
export async function POST(req: NextRequest) {
  const creator = await getCurrentCreator();
  const { platform, handle } = await req.json();
  if (!SUPPORTED.includes(platform)) {
    return NextResponse.json({ error: "Unsupported platform" }, { status: 400 });
  }

  const followers = Math.floor(20000 + Math.random() * 400000);
  const connection = await prisma.connection.upsert({
    where: { creatorId_platform: { creatorId: creator.id, platform } },
    create: {
      creatorId: creator.id,
      platform,
      handle: handle || creator.handle,
      followers,
      status: "connected",
    },
    update: {
      status: "connected",
      handle: handle || creator.handle,
      followers,
      connectedAt: new Date(),
    },
  });
  return NextResponse.json(connection, { status: 201 });
}
