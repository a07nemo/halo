"use client";

import { useEffect, useState } from "react";
import { Check } from "lucide-react";
import { SectionHeader, Spinner } from "@/components/ui";
import ThemeSwitcher from "@/components/ThemeSwitcher";
import { api } from "@/lib/ui";

export default function SettingsPage() {
  const [creator, setCreator] = useState<any>(null);
  const [saved, setSaved] = useState(false);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    api("/api/creator").then((d) => setCreator(d.creator));
  }, []);

  if (!creator) return <Spinner />;

  const set = (k: string, v: string) => setCreator((c: any) => ({ ...c, [k]: v }));

  const save = async () => {
    setBusy(true);
    try {
      await api("/api/creator", {
        method: "PATCH",
        body: JSON.stringify({
          name: creator.name,
          handle: creator.handle,
          niche: creator.niche,
          bio: creator.bio,
        }),
      });
      setSaved(true);
      setTimeout(() => setSaved(false), 1800);
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="mx-auto max-w-2xl">
      <SectionHeader title="Settings" subtitle="Tell Halo about you — it shapes every suggestion she makes." />

      <div className="card mb-6 p-6">
        <h2 className="font-semibold text-ink">Theme</h2>
        <p className="mb-4 mt-1 text-sm text-muted">Pick a look. It's saved and applies everywhere.</p>
        <ThemeSwitcher />
      </div>


      <div className="card p-6">
        <label className="label">Name</label>
        <input className="input mb-4" value={creator.name || ""} onChange={(e) => set("name", e.target.value)} />

        <label className="label">Handle</label>
        <input className="input mb-4" value={creator.handle || ""} onChange={(e) => set("handle", e.target.value)} />

        <label className="label">Niche</label>
        <input
          className="input mb-4"
          value={creator.niche || ""}
          onChange={(e) => set("niche", e.target.value)}
          placeholder="e.g. Sustainable lifestyle & travel"
        />

        <label className="label">Bio</label>
        <textarea
          className="input mb-5"
          rows={3}
          value={creator.bio || ""}
          onChange={(e) => set("bio", e.target.value)}
          placeholder="A line about who you help and how."
        />

        <button className="btn-primary" onClick={save} disabled={busy}>
          {saved ? (
            <>
              <Check size={16} /> Saved
            </>
          ) : busy ? (
            "Saving…"
          ) : (
            "Save changes"
          )}
        </button>
      </div>
    </div>
  );
}
