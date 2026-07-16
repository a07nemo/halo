import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getCurrentCreator } from "@/lib/current";

export const dynamic = "force-dynamic";

export async function GET() {
  const creator = await getCurrentCreator();
  const deals = await prisma.deal.findMany({
    where: { creatorId: creator.id },
    orderBy: { updatedAt: "desc" },
    include: {
      deliverables: { orderBy: { dueDate: "asc" } },
      events: true,
      posts: true,
    },
  });
  return NextResponse.json(deals);
}

export async function POST(req: NextRequest) {
  const creator = await getCurrentCreator();
  const body = await req.json();
  const deal = await prisma.deal.create({
    data: {
      creatorId: creator.id,
      brand: body.brand || "New Brand",
      contactName: body.contactName || null,
      contactEmail: body.contactEmail || null,
      status: body.status || "pitched",
      value: Number(body.value) || 0,
      currency: body.currency || "USD",
      startDate: body.startDate ? new Date(body.startDate) : null,
      dueDate: body.dueDate ? new Date(body.dueDate) : null,
      notes: body.notes || null,
      deliverables: Array.isArray(body.deliverables)
        ? {
            create: body.deliverables.map((d: any) => ({
              title: d.title,
              type: d.type || "post",
              quantity: Number(d.quantity) || 1,
              dueDate: d.dueDate ? new Date(d.dueDate) : null,
            })),
          }
        : undefined,
    },
    include: { deliverables: true },
  });
  return NextResponse.json(deal, { status: 201 });
}
