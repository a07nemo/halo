import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/db";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  const { name, email, password } = await req.json();
  if (!email || !password) {
    return NextResponse.json({ error: "Email and password are required" }, { status: 400 });
  }
  const normalized = String(email).toLowerCase().trim();
  const existing = await prisma.user.findUnique({ where: { email: normalized } });
  if (existing) {
    return NextResponse.json({ error: "An account with that email already exists" }, { status: 409 });
  }
  const passwordHash = await bcrypt.hash(password, 10);
  const user = await prisma.user.create({
    data: {
      name: name || normalized.split("@")[0],
      email: normalized,
      passwordHash,
      creator: {
        create: {
          name: name || "New Creator",
          handle: "@" + normalized.split("@")[0],
          niche: "Lifestyle",
          onboarded: false,
        },
      },
    },
  });
  return NextResponse.json({ ok: true, id: user.id }, { status: 201 });
}
