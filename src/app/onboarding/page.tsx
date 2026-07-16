"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, ArrowLeft, Check } from "lucide-react";
import HaloPortrait from "@/components/HaloPortrait";
import { api, platformLabel } from "@/lib/ui";

const NICHES = ["Beauty", "Fitness", "Travel", "Food", "Tech", "Gaming", "Fashion", "Lifestyle", "Finance", "Comedy"];
const PLATFORMS = ["instagram", "tiktok", "youtube", "x"];
const GOALS = ["Grow my following", "Land more brand deals", "Post more consistently", "Launch a product", "Build my community"];

export default function OnboardingPage() {
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [name, setName] = useState("");
  const [niche, setNiche] = useState("");
  const [platforms, setPlatforms] = useState<string[]>([]);
  const [goal, setGoal] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    api("/api/creator")
      .then((d) => {
        if (d?.creator?.onboarded) {
          router.replace("/dashboard");
          return;
        }
        if (d?.creator?.name && d.creator.name !== "New Creator") setName(d.creator.name);
      })
      .catch(() => {});
  }, [router]);

  const togglePlatform = (p: string) =>
    setPlatforms((prev) => (prev.includes(p) ? prev.filter((x) => x !== p) : [...prev, p]));

  const finish = async () => {
    setSaving(true);
    try {
      await api("/api/creator", {
        method: "PATCH",
        body: JSON.stringify({
          name: name || "Creator",
          niche: niche || "Lifestyle",
          bio: goal ? `Focused on: ${goal.toLowerCase()}.` : undefined,
          onboarded: true,
        }),
      });
      for (const p of platforms) {
        await api("/api/connections", { method: "POST", body: JSON.stringify({ platform: p }) }).catch(() => {});
      }
      router.push("/dashboard");
      router.refresh();
    } finally {
      setSaving(false);
    }
  };

  const steps = [
    {
      halo: "Hi, I'm Halo ✦ Give me 30 seconds and I'll set everything up around you.",
      body: (
        <div className="text-center">
          <button className="btn-primary text-base" onClick={() => setStep(1)}>
            Let's go <ArrowRight size={16} />
          </button>
        </div>
      ),
      canNext: false,
    },
    {
      halo: "First — what should I call you?",
      body: (
        <input
          className="input text-base"
          placeholder="Your name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          autoFocus
        />
      ),
      canNext: name.trim().length > 0,
    },
    {
      halo: "Love it. What's your world — the niche you create in?",
      body: (
        <div>
          <input
            className="input mb-3 text-base"
            placeholder="e.g. Sustainable travel"
            value={niche}
            onChange={(e) => setNiche(e.target.value)}
          />
          <div className="flex flex-wrap gap-2">
            {NICHES.map((n) => (
              <button
                key={n}
                onClick={() => setNiche(n)}
                className={`pill border ${niche === n ? "bg-c1 text-white" : "border-border text-ink-2"}`}
              >
                {n}
              </button>
            ))}
          </div>
        </div>
      ),
      canNext: niche.trim().length > 0,
    },
    {
      halo: "Where do you create? I'll pull your numbers together.",
      body: (
        <div className="grid grid-cols-2 gap-2">
          {PLATFORMS.map((p) => {
            const on = platforms.includes(p);
            return (
              <button
                key={p}
                onClick={() => togglePlatform(p)}
                className={`card flex items-center justify-between p-3 ${on ? "ring-2 ring-c1" : ""}`}
              >
                <span className="font-medium text-ink">{platformLabel[p]}</span>
                {on && (
                  <span className="flex h-5 w-5 items-center justify-center rounded-full bg-c1 text-white">
                    <Check size={12} />
                  </span>
                )}
              </button>
            );
          })}
        </div>
      ),
      canNext: true,
    },
    {
      halo: "Last thing — what are we chasing right now?",
      body: (
        <div className="flex flex-wrap gap-2">
          {GOALS.map((g) => (
            <button
              key={g}
              onClick={() => setGoal(g)}
              className={`pill border ${goal === g ? "bg-c1 text-white" : "border-border text-ink-2"}`}
            >
              {g}
            </button>
          ))}
        </div>
      ),
      canNext: goal.trim().length > 0,
      last: true,
    },
  ];

  const s = steps[step];
  const total = steps.length - 1;

  return (
    <div className="flex min-h-screen items-center justify-center px-6 py-12">
      <div className="w-full max-w-lg">
        {/* progress */}
        {step > 0 && (
          <div className="mb-6 flex gap-1.5">
            {Array.from({ length: total }).map((_, i) => (
              <div
                key={i}
                className={`h-1.5 flex-1 rounded-full ${i < step ? "bg-c1" : "bg-border"}`}
              />
            ))}
          </div>
        )}

        <div className="card p-8">
          <div className="mb-5 flex items-start gap-4">
            <div className="shrink-0"><HaloPortrait size={64} /></div>
            <div className="rounded-2xl rounded-bl-sm border border-border bg-surface-2/50 px-4 py-3">
              <div className="mb-1 font-mono text-[10px] uppercase tracking-wider text-muted">Halo</div>
              <AnimatePresence mode="wait">
                <motion.p
                  key={step}
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className="text-sm text-ink"
                >
                  {s.halo}
                </motion.p>
              </AnimatePresence>
            </div>
          </div>

          <AnimatePresence mode="wait">
            <motion.div
              key={step}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              className="mt-2"
            >
              {s.body}
            </motion.div>
          </AnimatePresence>

          {step > 0 && (
            <div className="mt-6 flex items-center justify-between">
              <button className="btn-ghost" onClick={() => setStep((v) => Math.max(0, v - 1))}>
                <ArrowLeft size={16} /> Back
              </button>
              {s.last ? (
                <button className="btn-primary" onClick={finish} disabled={!s.canNext || saving}>
                  {saving ? "Setting up…" : "Finish"} <Check size={16} />
                </button>
              ) : (
                <button className="btn-primary" onClick={() => setStep((v) => v + 1)} disabled={!s.canNext}>
                  Next <ArrowRight size={16} />
                </button>
              )}
            </div>
          )}
        </div>

        <button
          onClick={() => router.push("/dashboard")}
          className="mx-auto mt-4 block text-xs text-muted hover:text-ink"
        >
          Skip for now
        </button>
      </div>
    </div>
  );
}
