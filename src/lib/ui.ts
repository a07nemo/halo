// Shared UI helpers: colors, labels, formatting

export const PLATFORMS = ["instagram", "tiktok", "youtube", "x", "linkedin"] as const;

export const platformLabel: Record<string, string> = {
  instagram: "Instagram",
  tiktok: "TikTok",
  youtube: "YouTube",
  x: "X",
  linkedin: "LinkedIn",
};

export const platformColor: Record<string, string> = {
  instagram: "bg-pink-500/15 text-pink-300",
  tiktok: "bg-cyan-500/15 text-cyan-300",
  youtube: "bg-red-500/15 text-red-300",
  x: "bg-slate-400/15 text-slate-200",
  linkedin: "bg-blue-500/15 text-blue-300",
};

export const postStatusColor: Record<string, string> = {
  idea: "bg-slate-500/15 text-slate-300",
  draft: "bg-amber-500/15 text-amber-300",
  scheduled: "bg-violet-500/15 text-violet-300",
  published: "bg-emerald-500/15 text-emerald-300",
};

export const dealStatusColor: Record<string, string> = {
  pitched: "bg-slate-500/15 text-slate-300",
  negotiating: "bg-amber-500/15 text-amber-300",
  active: "bg-violet-500/15 text-violet-300",
  delivered: "bg-cyan-500/15 text-cyan-300",
  paid: "bg-emerald-500/15 text-emerald-300",
  archived: "bg-slate-600/15 text-slate-400",
};

export const DEAL_STATUSES = ["pitched", "negotiating", "active", "delivered", "paid", "archived"] as const;

export const deliverableStatusColor: Record<string, string> = {
  todo: "bg-slate-500/15 text-slate-300",
  in_progress: "bg-amber-500/15 text-amber-300",
  submitted: "bg-violet-500/15 text-violet-300",
  approved: "bg-emerald-500/15 text-emerald-300",
};

export const eventTypeColor: Record<string, string> = {
  shoot: "bg-violet-500/20 text-violet-200 border-violet-500/40",
  meeting: "bg-cyan-500/20 text-cyan-200 border-cyan-500/40",
  launch: "bg-pink-500/20 text-pink-200 border-pink-500/40",
  deadline: "bg-red-500/20 text-red-200 border-red-500/40",
  appearance: "bg-amber-500/20 text-amber-200 border-amber-500/40",
  general: "bg-slate-500/20 text-slate-200 border-slate-500/40",
};

export function fmtMoney(n: number, currency = "USD") {
  return new Intl.NumberFormat("en-US", { style: "currency", currency, maximumFractionDigits: 0 }).format(n);
}

export function fmtNumber(n: number) {
  if (n >= 1_000_000) return (n / 1_000_000).toFixed(1).replace(/\.0$/, "") + "M";
  if (n >= 1_000) return (n / 1_000).toFixed(1).replace(/\.0$/, "") + "K";
  return String(n);
}

export function titleCase(s: string) {
  return s.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
}

export async function api(path: string, options?: RequestInit) {
  const res = await fetch(path, {
    headers: { "Content-Type": "application/json" },
    ...options,
  });
  if (!res.ok) throw new Error(`Request failed: ${res.status}`);
  return res.json();
}
