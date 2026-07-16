import { NextRequest, NextResponse } from "next/server";
import { generateIdeas, aiEnabled } from "@/lib/ai";
import { getCurrentCreator } from "@/lib/current";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  const creator = await getCurrentCreator();
  const body = await req.json();
  const ideas = await generateIdeas({
    niche: body.niche || creator.niche,
    platform: body.platform || "instagram",
    topic: body.topic,
    count: body.count || 5,
  });
  return NextResponse.json({ ideas, aiEnabled: aiEnabled() });
}
