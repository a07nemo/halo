import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export const dynamic = "force-dynamic";

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  const body = await req.json();
  const data: any = {};
  for (const key of ["title", "type", "status"]) {
    if (key in body) data[key] = body[key];
  }
  if ("quantity" in body) data.quantity = Number(body.quantity) || 1;
  if ("dueDate" in body) data.dueDate = body.dueDate ? new Date(body.dueDate) : null;
  const deliverable = await prisma.deliverable.update({ where: { id: params.id }, data });
  return NextResponse.json(deliverable);
}

export async function DELETE(_req: NextRequest, { params }: { params: { id: string } }) {
  await prisma.deliverable.delete({ where: { id: params.id } });
  return NextResponse.json({ ok: true });
}
