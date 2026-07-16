"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Instagram, Youtube, Check, Loader2, Plus, X } from "lucide-react";
import { SectionHeader, Spinner } from "@/components/ui";
import { api, fmtNumber, platformLabel } from "@/lib/ui";

const PLATFORMS = [
  { id: "instagram", label: "Instagram", icon: Instagram, color: "#ec4899", note: "Reels, stories & insights" },
  { id: "tiktok", label: "TikTok", icon: null, color: "#22d3ee", note: "Videos & audience data" },
  { id: "youtube", label: "YouTube", icon: Youtube, color: "#ef4444", note: "Subscribers & views" },
  { id: "x", label: "X", icon: null, color: "#94a3b8", note: "Posts & followers" },
];

export default function ConnectionsPage() {
  const [connections, setConnections] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState<string | null>(null);

  const load = () => api("/api/connections").then(setConnections).finally(() => setLoading(false));
  useEffect(() => {
    load();
  }, []);

  const connect = async (platform: string) => {
    setBusy(platform);
    try {
      // Simulated OAuth handshake
      await new Promise((r) => setTimeout(r, 900));
      await api("/api/connections", { method: "POST", body: JSON.stringify({ platform }) });
      await load();
    } finally {
      setBusy(null);
    }
  };

  const disconnect = async (platform: string) => {
    setBusy(platform);
    try {
      await api(`/api/connections/${platform}`, { method: "DELETE" });
      await load();
    } finally {
      setBusy(null);
    }
  };

  if (loading) return <Spinner />;

  const byPlatform: Record<string, any> = {};
  for (const c of connections) byPlatform[c.platform] = c;

  return (
    <div className="mx-auto max-w-4xl">
      <SectionHeader
        title="Connections"
        subtitle="Link your platforms so Halo can pull your numbers together."
      />

      <div className="mb-5 rounded-xl border border-halo-500/30 bg-halo-600/10 p-4 text-sm text-halo-100">
        <span className="font-medium">Sandbox mode.</span> Connecting simulates the sign-in and loads
        sample data. Real platform sync switches on once developer credentials are added.
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        {PLATFORMS.map((p, i) => {
          const conn = byPlatform[p.id];
          const connected = conn?.status === "connected";
          const Icon = p.icon;
          return (
            <motion.div
              key={p.id}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.06 }}
              className="card p-5"
            >
              <div className="flex items-center gap-3">
                <div
                  className="flex h-11 w-11 items-center justify-center rounded-xl text-white"
                  style={{ background: `${p.color}22`, color: p.color }}
                >
                  {Icon ? <Icon size={20} /> : <span className="text-sm font-bold">{p.label[0]}</span>}
                </div>
                <div className="flex-1">
                  <div className="font-semibold">{p.label}</div>
                  <div className="text-xs text-muted">
                    {connected ? `${conn.handle} · ${fmtNumber(conn.followers)} followers` : p.note}
                  </div>
                </div>
                {connected && (
                  <span className="pill bg-emerald-500/15 text-emerald-300">
                    <Check size={12} /> Connected
                  </span>
                )}
              </div>

              <div className="mt-4">
                {connected ? (
                  <button
                    onClick={() => disconnect(p.id)}
                    disabled={busy === p.id}
                    className="btn-ghost w-full text-red-300 hover:bg-red-500/10"
                  >
                    {busy === p.id ? <Loader2 size={16} className="animate-spin" /> : <X size={16} />}
                    Disconnect
                  </button>
                ) : (
                  <button
                    onClick={() => connect(p.id)}
                    disabled={busy === p.id}
                    className="btn-primary w-full"
                  >
                    {busy === p.id ? (
                      <>
                        <Loader2 size={16} className="animate-spin" /> Connecting…
                      </>
                    ) : (
                      <>
                        <Plus size={16} /> Connect {p.label}
                      </>
                    )}
                  </button>
                )}
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
