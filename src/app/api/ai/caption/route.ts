import { NextRequest, NextResponse } from "next/server";
import { generateCaption, aiEnabled } from "@/lib/ai";
import { getCurrentCreator } from "@/lib/current";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  const creator = await getCurrentCreator();
  const body = await req.json();
  if (!body.topic) return NextResponse.json({ error: "topic required" }, { status: 400 });
  const result = await generateCaption({
    niche: body.niche || creator.niche,
    platform: body.platform || "instagram",
    topic: body.topic,
    tone: body.tone,
    brand: body.brand,
  });
  return NextResponse.json({ ...result, aiEnabled: aiEnabled() });
}
