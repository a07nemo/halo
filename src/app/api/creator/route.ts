import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getCurrentCreator } from "@/lib/current";
import { aiEnabled } from "@/lib/ai";

export const dynamic = "force-dynamic";

export async function GET() {
  const creator = await getCurrentCreator();
  return NextResponse.json({ creator, aiEnabled: aiEnabled() });
}

export async function PATCH(req: NextRequest) {
  const creator = await getCurrentCreator();
  const body = await req.json();
  const data: any = {};
  for (const key of ["name", "handle", "niche", "bio", "avatar", "theme", "onboarded"]) {
    if (key in body) data[key] = body[key];
  }
  const updated = await prisma.creator.update({ where: { id: creator.id }, data });
  return NextResponse.json(updated);
}
