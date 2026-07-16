import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getCurrentCreator } from "@/lib/current";

export const dynamic = "force-dynamic";

export async function GET() {
  const creator = await getCurrentCreator();
  const posts = await prisma.post.findMany({
    where: { creatorId: creator.id },
    orderBy: [{ status: "asc" }, { updatedAt: "desc" }],
    include: { deal: true },
  });
  return NextResponse.json(posts);
}

export async function POST(req: NextRequest) {
  const creator = await getCurrentCreator();
  const body = await req.json();
  const post = await prisma.post.create({
    data: {
      creatorId: creator.id,
      title: body.title || "Untitled",
      caption: body.caption || "",
      hashtags: body.hashtags || "",
      platform: body.platform || "instagram",
      status: body.status || "idea",
      scheduledAt: body.scheduledAt ? new Date(body.scheduledAt) : null,
      dealId: body.dealId || null,
    },
  });
  return NextResponse.json(post, { status: 201 });
}
