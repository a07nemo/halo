import Anthropic from "@anthropic-ai/sdk";

// Halo can be powered by either xAI (Grok) or Anthropic (Claude).
// Set XAI_API_KEY to use Grok, or ANTHROPIC_API_KEY to use Claude.
// With neither, Halo uses built-in smart mock responses so it always works.
const XAI_MODEL = process.env.XAI_MODEL || "grok-4.5";
const ANTHROPIC_MODEL = process.env.ANTHROPIC_MODEL || "claude-sonnet-4-20250514";

function xaiEnabled() {
  return Boolean(process.env.XAI_API_KEY);
}
function anthropicEnabled() {
  return Boolean(process.env.ANTHROPIC_API_KEY);
}
export function aiEnabled() {
  return xaiEnabled() || anthropicEnabled();
}

type Msg = { role: "user" | "assistant"; content: string };

/**
 * Unified chat call. Prefers Grok (xAI, OpenAI-compatible) when XAI_API_KEY is
 * set, otherwise Claude. Returns "" on failure so callers fall back to mocks.
 */
async function llm(system: string, messages: Msg[], maxTokens = 800): Promise<string> {
  try {
    if (xaiEnabled()) {
      const res = await fetch("https://api.x.ai/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${process.env.XAI_API_KEY}`,
        },
        body: JSON.stringify({
          model: XAI_MODEL,
          max_tokens: maxTokens,
          messages: [{ role: "system", content: system }, ...messages],
        }),
      });
      if (!res.ok) return "";
      const data = await res.json();
      return data?.choices?.[0]?.message?.content ?? "";
    }

    if (anthropicEnabled()) {
      const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });
      const res = await client.messages.create({
        model: ANTHROPIC_MODEL,
        max_tokens: maxTokens,
        system,
        messages: messages as Anthropic.MessageParam[],
      });
      const block = res.content.find((b) => b.type === "text");
      return block && block.type === "text" ? block.text : "";
    }
  } catch {
    return "";
  }
  return "";
}

const HALO_PERSONA =
  "You are Halo, an AI manager for social media influencers and content creators. " +
  "You are sharp, warm, a little sassy, and deeply practical. You understand platforms " +
  "(Instagram, TikTok, YouTube, X), brand deals, PR, invoicing, and growth. Keep advice " +
  "concrete and creator-friendly.";

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
    const text = await llm(
      HALO_PERSONA,
      [
        {
          role: "user",
          content:
            `Generate ${count} scroll-stopping ${input.platform} content ideas for a creator in the "${input.niche}" niche` +
            (input.topic ? ` about "${input.topic}"` : "") +
            `. Return each idea on its own line, no numbering, no extra commentary.`,
        },
      ],
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
    const text = await llm(
      HALO_PERSONA,
      [
        {
          role: "user",
          content:
            `Write a ${input.platform} caption for a "${input.niche}" creator about "${input.topic}". ` +
            `Tone: ${tone}.` +
            (input.brand
              ? ` This is a paid partnership with ${input.brand} — include a natural, compliant #ad disclosure.`
              : "") +
            ` Then on a new line starting with "HASHTAGS:" list 5-8 relevant hashtags. ` +
            `Format exactly as: caption text, blank line, then HASHTAGS: #a #b #c`,
        },
      ],
      500
    );
    const [capPart, tagPart] = text.split(/HASHTAGS:/i);
    if (capPart) {
      return { caption: capPart.trim(), hashtags: (tagPart || "").trim() };
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
    const reply = await llm(
      system,
      history.map((m) => ({ role: m.role === "assistant" ? "assistant" : "user", content: m.content })),
      800
    );
    if (reply) return reply;
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
      `Want me to draft captions for any of these? (Add an XAI_API_KEY or ANTHROPIC_API_KEY to unlock full AI replies.)`
    );
  }
  if (last.includes("deal") || last.includes("brand") || last.includes("pr")) {
    return (
      `You've got ${ctx.activeDeals} active brand deals right now. My quick take: keep deliverables front-loaded so ` +
      `you're not scrambling near due dates, and always confirm usage rights in writing. Want a checklist for your next pitch? ` +
      `(Full AI answers unlock with an XAI_API_KEY or ANTHROPIC_API_KEY.)`
    );
  }
  return (
    `Hi ${ctx.creatorName}! I'm running in demo mode right now, but I can still help you organize content, deals, and your calendar. ` +
    `Add an XAI_API_KEY (Grok) or ANTHROPIC_API_KEY (Claude) to unlock full AI replies. What would you like to work on?`
  );
}
