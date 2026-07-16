import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  const body = await req.json();
  if (!body.dealId) return NextResponse.json({ error: "dealId required" }, { status: 400 });
  const deliverable = await prisma.deliverable.create({
    data: {
      dealId: body.dealId,
      title: body.title || "New deliverable",
      type: body.type || "post",
      quantity: Number(body.quantity) || 1,
      status: body.status || "todo",
      dueDate: body.dueDate ? new Date(body.dueDate) : null,
    },
  });
  return NextResponse.json(deliverable, { status: 201 });
}
