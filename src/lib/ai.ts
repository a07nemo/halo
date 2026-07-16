import Anthropic from "@anthropic-ai/sdk";

const MODEL = process.env.ANTHROPIC_MODEL || "claude-sonnet-4-20250514";

export function aiEnabled() {
  return Boolean(process.env.ANTHROPIC_API_KEY);
}

let client: Anthropic | null = null;
function getClient() {
  if (!client) client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });
  return client;
}

/**
 * Core text generation. Uses Claude if ANTHROPIC_API_KEY is set,
 * otherwise falls back to smart local mock generators so the app
 * is fully functional out of the box.
 */
async function complete(system: string, user: string, maxTokens = 1024): Promise<string> {
  if (!aiEnabled()) return "";
  const res = await getClient().messages.create({
    model: MODEL,
    max_tokens: maxTokens,
    system,
    messages: [{ role: "user", content: user }],
  });
  const block = res.content.find((b) => b.type === "text");
  return block && block.type === "text" ? block.text : "";
}

const HALO_PERSONA =
  "You are Halo, an AI assistant for social media influencers and content creators. " +
  "You are sharp, upbeat, and practical. You understand platforms (Instagram, TikTok, YouTube, X), " +
  "brand deals, PR, and growth. Keep advice concrete and creator-friendly.";

// ---------- Content ideas ----------
export interface IdeaInput {
  niche: string;
  platform: string;
  topic?: string;
  count?: number;
}
export async function generateIdeas(input: IdeaInput): Promise<string[]> {
  const count = input.count ?? 5;
  if (aiEnabled()) {
    const text = await complete(
      HALO_PERSONA,
      `Generate ${count} scroll-stopping ${input.platform} content ideas for a creator in the "${input.niche}" niche` +
        (input.topic ? ` about "${input.topic}"` : "") +
        `. Return each idea on its own line, no numbering, no extra commentary.`,
      700
    );
    const lines = text
      .split("\n")
      .map((l) => l.replace(/^[-*\d.)\s]+/, "").trim())
      .filter(Boolean);
    if (lines.length) return lines.slice(0, count);
  }
  return mockIdeas(input, count);
}

// ---------- Captions ----------
export interface CaptionInput {
  niche: string;
  platform: string;
  topic: string;
  tone?: string;
  brand?: string;
}
export interface CaptionResult {
  caption: string;
  hashtags: string;
}
export async function generateCaption(input: CaptionInput): Promise<CaptionResult> {
  const tone = input.tone || "authentic and warm";
  if (aiEnabled()) {
    const text = await complete(
      HALO_PERSONA,
      `Write a ${input.platform} caption for a "${input.niche}" creator about "${input.topic}". ` +
        `Tone: ${tone}.` +
        (input.brand ? ` This is a paid partnership with ${input.brand} — include a natural, compliant #ad disclosure.` : "") +
        ` Then on a new line starting with "HASHTAGS:" list 5-8 relevant hashtags. ` +
        `Format exactly as: caption text, blank line, then HASHTAGS: #a #b #c`,
      500
    );
    const [capPart, tagPart] = text.split(/HASHTAGS:/i);
    if (capPart) {
      return {
        caption: capPart.trim(),
        hashtags: (tagPart || "").trim(),
      };
    }
  }
  return mockCaption(input);
}

// ---------- Chat ----------
export interface ChatContext {
  creatorName: string;
  niche: string;
  activeDeals: number;
  upcomingEvents: number;
  followerTotal: number;
}
export async function chat(
  history: { role: string; content: string }[],
  ctx: ChatContext
): Promise<string> {
  if (aiEnabled()) {
    const system =
      HALO_PERSONA +
      `\n\nContext about the creator you're helping:\n` +
      `- Name: ${ctx.creatorName}\n- Niche: ${ctx.niche}\n` +
      `- Active brand deals: ${ctx.activeDeals}\n- Upcoming events: ${ctx.upcomingEvents}\n` +
      `- Total followers: ${ctx.followerTotal.toLocaleString()}\n` +
      `Use this context when relevant. Be concise.`;
    const res = await getClient().messages.create({
      model: MODEL,
      max_tokens: 800,
      system,
      messages: history.map((m) => ({
        role: m.role === "assistant" ? "assistant" : "user",
        content: m.content,
      })) as Anthropic.MessageParam[],
    });
    const block = res.content.find((b) => b.type === "text");
    if (block && block.type === "text") return block.text;
  }
  return mockChat(history, ctx);
}

// ============ MOCK FALLBACKS ============

function mockIdeas(input: IdeaInput, count: number): string[] {
  const t = input.topic ? input.topic : input.niche;
  const templates = [
    `"I tried ${t} for 30 days" — an honest before/after story`,
    `3 myths about ${t} your followers still believe`,
    `A day-in-the-life built entirely around ${t}`,
    `The ${t} starter kit under $50 (save-worthy carousel)`,
    `Reacting to the worst ${t} advice on the internet`,
    `${t}: what nobody tells beginners`,
    `Green flags vs red flags when it comes to ${t}`,
    `A get-ready-with-me while I explain my ${t} routine`,
    `POV: your first week trying ${t}`,
    `I asked 100 people about ${t} — the answers surprised me`,
  ];
  // deterministic-ish shuffle
  return templates.slice(0, count);
}

function mockCaption(input: CaptionInput): CaptionResult {
  const brandTag = input.brand ? ` in partnership with ${input.brand}` : "";
  const ad = input.brand ? " #ad" : "";
  const caption =
    `Real talk about ${input.topic}${brandTag} 👇\n\n` +
    `I get asked about this constantly, so here's the honest version — no fluff, just what's actually worked for me. ` +
    `Save this one and tell me your take in the comments. Which part surprised you?`;
  const nicheTag = input.niche.split(/\s|&|,/).filter(Boolean)[0]?.toLowerCase() || "creator";
  const topicTag = input.topic.split(/\s/)[0]?.toLowerCase() || "tips";
  const hashtags = `#${nicheTag} #${topicTag} #creatorlife #${input.platform} #tips${ad}`;
  return { caption, hashtags };
}

function mockChat(history: { role: string; content: string }[], ctx: ChatContext): string {
  const last = history.filter((m) => m.role === "user").slice(-1)[0]?.content.toLowerCase() || "";
  if (last.includes("idea") || last.includes("post") || last.includes("content")) {
    return (
      `Here are a few angles for your ${ctx.niche} audience:\n\n` +
      `1. A myth-busting reel — high saves, great for reach.\n` +
      `2. A behind-the-scenes of one of your ${ctx.activeDeals} active deals.\n` +
      `3. A "what I'd tell my past self" story post.\n\n` +
      `Want me to draft captions for any of these? (Add an ANTHROPIC_API_KEY to unlock full AI replies.)`
    );
  }
  if (last.includes("deal") || last.includes("brand") || last.includes("pr")) {
    return (
      `You've got ${ctx.activeDeals} active brand deals right now. My quick take: keep deliverables front-loaded so ` +
      `you're not scrambling near due dates, and always confirm usage rights in writing. Want a checklist for your next pitch? ` +
      `(Full AI answers unlock with an ANTHROPIC_API_KEY.)`
    );
  }
  return (
    `Hi ${ctx.creatorName}! I'm running in demo mode right now, but I can still help you organize content, deals, and your calendar. ` +
    `Add an ANTHROPIC_API_KEY in your .env to unlock full Claude-powered replies. What would you like to work on?`
  );
}
