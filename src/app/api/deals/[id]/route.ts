import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export const dynamic = "force-dynamic";

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  const body = await req.json();
  const data: any = {};
  for (const key of ["brand", "contactName", "contactEmail", "status", "currency", "notes"]) {
    if (key in body) data[key] = body[key];
  }
  if ("value" in body) data.value = Number(body.value) || 0;
  if ("startDate" in body) data.startDate = body.startDate ? new Date(body.startDate) : null;
  if ("dueDate" in body) data.dueDate = body.dueDate ? new Date(body.dueDate) : null;
  const deal = await prisma.deal.update({
    where: { id: params.id },
    data,
    include: { deliverables: true },
  });
  return NextResponse.json(deal);
}

export async function DELETE(_req: NextRequest, { params }: { params: { id: string } }) {
  await prisma.deal.delete({ where: { id: params.id } });
  return NextResponse.json({ ok: true });
}
