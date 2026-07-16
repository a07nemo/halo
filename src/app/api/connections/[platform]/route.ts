import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getCurrentCreator } from "@/lib/current";

export const dynamic = "force-dynamic";

// Disconnect a platform
export async function DELETE(_req: NextRequest, { params }: { params: { platform: string } }) {
  const creator = await getCurrentCreator();
  await prisma.connection.deleteMany({
    where: { creatorId: creator.id, platform: params.platform },
  });
  return NextResponse.json({ ok: true });
}
