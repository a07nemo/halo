import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export const dynamic = "force-dynamic";

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  const body = await req.json();
  const data: any = {};
  for (const key of ["title", "caption", "hashtags", "platform", "status", "dealId"]) {
    if (key in body) data[key] = body[key];
  }
  if ("scheduledAt" in body) data.scheduledAt = body.scheduledAt ? new Date(body.scheduledAt) : null;
  if (body.status === "published" && !body.publishedAt) data.publishedAt = new Date();
  const post = await prisma.post.update({ where: { id: params.id }, data });
  return NextResponse.json(post);
}

export async function DELETE(_req: NextRequest, { params }: { params: { id: string } }) {
  await prisma.post.delete({ where: { id: params.id } });
  return NextResponse.json({ ok: true });
}
