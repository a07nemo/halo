import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export const dynamic = "force-dynamic";

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  const body = await req.json();
  const data: any = {};
  for (const key of ["title", "type", "location", "notes", "dealId"]) {
    if (key in body) data[key] = body[key];
  }
  if ("startAt" in body) data.startAt = new Date(body.startAt);
  if ("endAt" in body) data.endAt = body.endAt ? new Date(body.endAt) : null;
  const event = await prisma.event.update({ where: { id: params.id }, data });
  return NextResponse.json(event);
}

export async function DELETE(_req: NextRequest, { params }: { params: { id: string } }) {
  await prisma.event.delete({ where: { id: params.id } });
  return NextResponse.json({ ok: true });
}
