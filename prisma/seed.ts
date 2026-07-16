import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

function daysFromNow(n: number, hour = 10) {
  const d = new Date();
  d.setDate(d.getDate() + n);
  d.setHours(hour, 0, 0, 0);
  return d;
}

async function main() {
  console.log("Resetting data...");
  await prisma.chatMessage.deleteMany();
  await prisma.metric.deleteMany();
  await prisma.event.deleteMany();
  await prisma.deliverable.deleteMany();
  await prisma.post.deleteMany();
  await prisma.deal.deleteMany();
  await prisma.connection.deleteMany();
  await prisma.creator.deleteMany();
  await prisma.account.deleteMany();
  await prisma.session.deleteMany();
  await prisma.user.deleteMany();

  console.log("Creating demo user + creator...");
  const passwordHash = await bcrypt.hash("halo1234", 10);
  const user = await prisma.user.create({
    data: {
      name: "Maya Rivers",
      email: "demo@halo.app",
      passwordHash,
    },
  });
  const creator = await prisma.creator.create({
    data: {
      userId: user.id,
      name: "Maya Rivers",
      handle: "@mayarivers",
      niche: "Sustainable lifestyle & travel",
      bio: "Helping 480k people live lighter. Eco travel, slow fashion, honest reviews.",
      onboarded: true,
      avatar: null,
    },
  });

  console.log("Creating social connections...");
  await prisma.connection.createMany({
    data: [
      { creatorId: creator.id, platform: "instagram", handle: "@mayarivers", followers: 302000 },
      { creatorId: creator.id, platform: "tiktok", handle: "@mayarivers", followers: 138000 },
      { creatorId: creator.id, platform: "youtube", handle: "Maya Rivers", followers: 41000 },
    ],
  });

  // ---- Deals ----
  console.log("Creating deals + deliverables...");
  const glow = await prisma.deal.create({
    data: {
      creatorId: creator.id,
      brand: "Glow Botanics",
      contactName: "Priya Shah",
      contactEmail: "priya@glowbotanics.com",
      status: "active",
      value: 6500,
      startDate: daysFromNow(-10),
      dueDate: daysFromNow(8),
      notes: "Spring skincare launch. Wants authentic morning-routine angle. No filters on product shots.",
      deliverables: {
        create: [
          { title: "Launch reel", type: "reel", quantity: 1, status: "in_progress", dueDate: daysFromNow(5) },
          { title: "Feed carousel", type: "post", quantity: 1, status: "todo", dueDate: daysFromNow(6) },
          { title: "Story set (3)", type: "story", quantity: 3, status: "todo", dueDate: daysFromNow(8) },
        ],
      },
    },
  });

  const wander = await prisma.deal.create({
    data: {
      creatorId: creator.id,
      brand: "Wander Co.",
      contactName: "Tom Beck",
      contactEmail: "partnerships@wander.co",
      status: "negotiating",
      value: 12000,
      startDate: daysFromNow(14),
      dueDate: daysFromNow(45),
      notes: "Carry-on collab. Negotiating usage rights + a Lisbon shoot trip.",
      deliverables: {
        create: [
          { title: "Destination vlog", type: "video", quantity: 1, status: "todo", dueDate: daysFromNow(40) },
          { title: "UGC bundle", type: "ugc", quantity: 5, status: "todo", dueDate: daysFromNow(44) },
        ],
      },
    },
  });

  const terra = await prisma.deal.create({
    data: {
      creatorId: creator.id,
      brand: "Terra Threads",
      contactName: "Nadia Cole",
      contactEmail: "nadia@terrathreads.com",
      status: "delivered",
      value: 4000,
      startDate: daysFromNow(-30),
      dueDate: daysFromNow(-4),
      notes: "Organic cotton capsule. Delivered, invoice sent.",
      deliverables: {
        create: [
          { title: "Try-on reel", type: "reel", quantity: 1, status: "approved", dueDate: daysFromNow(-6) },
          { title: "Feed post", type: "post", quantity: 2, status: "approved", dueDate: daysFromNow(-5) },
        ],
      },
    },
  });

  await prisma.deal.create({
    data: {
      creatorId: creator.id,
      brand: "Lumen Coffee",
      contactName: "Sam O.",
      status: "pitched",
      value: 3000,
      notes: "Cold pitch sent — waiting to hear back on a sampler collab.",
    },
  });

  // ---- Posts ----
  console.log("Creating posts...");
  await prisma.post.createMany({
    data: [
      {
        creatorId: creator.id,
        title: "Morning glow routine",
        caption: "5 minutes, 3 products, zero fuss. My spring skincare reset with @glowbotanics ✨ Save this for slow mornings.",
        hashtags: "#skincare #cleanbeauty #morningroutine #ad",
        platform: "instagram",
        status: "scheduled",
        scheduledAt: daysFromNow(2, 9),
        dealId: glow.id,
      },
      {
        creatorId: creator.id,
        title: "Packing light: 7 days, 1 bag",
        caption: "The exact capsule I take everywhere. Swipe for the full list.",
        hashtags: "#packinglight #slowtravel #minimalist",
        platform: "instagram",
        status: "draft",
      },
      {
        creatorId: creator.id,
        title: "Terra Threads try-on",
        caption: "Organic cotton that actually lasts. Wearing the capsule on repeat.",
        hashtags: "#slowfashion #organiccotton #ad",
        platform: "tiktok",
        status: "published",
        publishedAt: daysFromNow(-5, 18),
        dealId: terra.id,
      },
      {
        creatorId: creator.id,
        title: "Is 'eco' just marketing?",
        caption: "Reading a label so you don't have to. Green flags vs greenwashing 🧵",
        hashtags: "#sustainability #greenwashing",
        platform: "x",
        status: "idea",
      },
    ],
  });

  // ---- Events ----
  console.log("Creating events...");
  await prisma.event.createMany({
    data: [
      { creatorId: creator.id, dealId: glow.id, title: "Glow Botanics reel shoot", type: "shoot", location: "Home studio", startAt: daysFromNow(2, 8), endAt: daysFromNow(2, 12) },
      { creatorId: creator.id, dealId: wander.id, title: "Wander Co. contract call", type: "meeting", location: "Zoom", startAt: daysFromNow(1, 15), endAt: daysFromNow(1, 16) },
      { creatorId: creator.id, dealId: glow.id, title: "Glow launch goes live", type: "launch", startAt: daysFromNow(8, 9) },
      { creatorId: creator.id, title: "Content batch day", type: "shoot", location: "Rooftop", startAt: daysFromNow(4, 10), endAt: daysFromNow(4, 17) },
      { creatorId: creator.id, dealId: glow.id, title: "Story set due", type: "deadline", startAt: daysFromNow(8, 18) },
    ],
  });

  // ---- Metrics (last 30 days, per platform) ----
  console.log("Creating metrics...");
  const platforms = [
    { name: "instagram", base: 302000, growth: 210 },
    { name: "tiktok", base: 138000, growth: 340 },
    { name: "youtube", base: 41000, growth: 55 },
  ];
  const metricRows = [];
  for (const p of platforms) {
    let followers = p.base;
    for (let i = 29; i >= 0; i--) {
      const noise = Math.round((Math.random() - 0.35) * p.growth);
      followers += p.growth + noise;
      const reach = Math.round(followers * (0.35 + Math.random() * 0.4));
      const impressions = Math.round(reach * (1.3 + Math.random() * 0.6));
      const engagements = Math.round(reach * (0.04 + Math.random() * 0.05));
      metricRows.push({
        creatorId: creator.id,
        date: daysFromNow(-i, 12),
        platform: p.name,
        followers,
        reach,
        impressions,
        engagements,
      });
    }
  }
  await prisma.metric.createMany({ data: metricRows });

  // ---- Chat history ----
  await prisma.chatMessage.createMany({
    data: [
      { creatorId: creator.id, role: "assistant", content: "Hey Maya! I'm Halo. Ask me for content ideas, caption help, or a read on your week. What are we working on?" },
    ],
  });

  console.log("Seed complete ✅");
  console.log("Demo login →  email: demo@halo.app   password: halo1234");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
