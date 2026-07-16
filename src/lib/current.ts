import { getServerSession } from "next-auth";
import { authOptions } from "./auth";
import { prisma } from "./db";

/**
 * Resolves the Creator profile for the logged-in user.
 * - If a session exists, returns (or lazily creates) that user's creator.
 * - If there's no session (e.g. local demo before login), falls back to the
 *   first creator so the app is still explorable.
 */
export async function getCurrentCreator() {
  const session = await getServerSession(authOptions);
  const userId = (session?.user as { id?: string } | undefined)?.id;

  if (userId) {
    let creator = await prisma.creator.findUnique({ where: { userId } });
    if (!creator) {
      const user = await prisma.user.findUnique({ where: { id: userId } });
      creator = await prisma.creator.create({
        data: {
          userId,
          name: user?.name || "New Creator",
          handle: "@" + (user?.email?.split("@")[0] || "you"),
          niche: "Lifestyle",
          onboarded: false,
        },
      });
    }
    return creator;
  }

  // Fallback: demo/first creator
  let creator = await prisma.creator.findFirst({ orderBy: { createdAt: "asc" } });
  if (!creator) {
    creator = await prisma.creator.create({
      data: { name: "New Creator", handle: "@you", niche: "Lifestyle" },
    });
  }
  return creator;
}
