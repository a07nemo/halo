"use client";

import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  ArrowRight,
  Play,
  Sparkles,
  CalendarDays,
  BarChart3,
  Handshake,
  Receipt,
  Heart,
  Plus,
} from "lucide-react";
import HaloPortrait from "@/components/HaloPortrait";

const fadeUp = {
  hidden: { opacity: 0, y: 22 },
  show: (i = 0) => ({ opacity: 1, y: 0, transition: { duration: 0.5, delay: i * 0.06, ease: "easeOut" } }),
};

const marquee = [
  "Capture", "Schedule", "Analyze", "Negotiate", "Invoice", "Remember fans", "Hit goals", "Repeat",
];

const heroBubbles = [
  { side: "left", top: "6%", delay: 0, from: "Halo", text: "morning ✦ I drafted 3 hooks for the reel — pick a fave?" },
  { side: "right", top: "28%", delay: 1.6, small: true, text: "👀 ok show me" },
  { side: "left", top: "50%", delay: 3.2, from: "Halo", text: "Notion replied — they'll do $4.2k. I countered at $5k." },
  { side: "right", top: "72%", delay: 4.8, small: true, text: "you're a wizard" },
];

const moments = [
  { time: "8:14 AM", title: "She gets in before you do.", vibe: "morning brief", color: "var(--c1c)", cta: "see brief",
    msg: "morning ✦ overnight you got 2 brand DMs, 412 new followers, and an idea you voice-noted at 1am. I sorted it. coffee first?" },
  { time: "11:30 AM", title: "She drafts, you decide.", vibe: "writing", color: "var(--c4c)", cta: "pick one",
    msg: "wrote 3 caption options for the studio reel — A is your usual voice, B is funnier, C is a soft sell for the course. I'm voting B 💅" },
  { time: "2:08 PM", title: "She negotiates so you don't.", vibe: "deals", color: "var(--c3c)", cta: "approve",
    msg: "Notion came back at $4.2k for one Reel + one Story. I countered $5.5k bundled with usage rights for 90 days. they're thinking." },
  { time: "4:45 PM", title: "She remembers what you forget.", vibe: "fans", color: "var(--c5c)", cta: "yes please",
    msg: "Maya (bought your course in Feb) just left a really sweet comment. want me to send a thank-you DM in your voice?" },
  { time: "9:30 PM", title: "She closes the loop.", vibe: "wind down", color: "var(--c2c)", cta: "goodnight",
    msg: "today: shipped 1 reel · banked $1,840 · gained 612 followers · talked to 3 fans · one brand pending. proud of you. log off 💜" },
];

const features = [
  { icon: Sparkles, color: "var(--c1c)", name: "Capture", h: "Every idea, caught mid-scroll", p: "Voice-note it, paste it, think it out loud — Halo turns the chaos into a tidy content pipeline." },
  { icon: CalendarDays, color: "var(--c4c)", name: "Schedule", h: "A calendar that fills itself", p: "She slots your posts, shoots, and launches around your real life, then nudges you before each one." },
  { icon: BarChart3, color: "var(--c5c)", name: "Analyze", h: "Growth, read out loud", p: "No dashboards to decode — Halo tells you what's working and where to lean in next." },
  { icon: Handshake, color: "var(--c3c)", name: "Negotiate", h: "She handles the brands", p: "From first DM to signed deal and every deliverable in between, so you never undersell yourself." },
  { icon: Receipt, color: "var(--c2c)", name: "Invoice", h: "Money that actually arrives", p: "Halo sends invoices, chases the late ones, and keeps your pipeline value in plain sight." },
  { icon: Heart, color: "var(--c1c)", name: "Remember fans", h: "Every superfan by name", p: "She remembers who bought what and who to thank — so your community feels genuinely seen." },
];

const faqs = [
  { q: "Is Halo actually an AI, or just a dashboard?", a: "She's an AI manager with a personality. You talk to her like a person — she captures, drafts, negotiates, and reminds. The app is just where the work lives." },
  { q: "Which platforms does she work with?", a: "Instagram, TikTok, YouTube, and X to start, with more coming. Connect an account and she pulls your numbers together automatically." },
  { q: "Do I need my own API keys?", a: "No. Halo runs out of the box with smart built-in responses. Add an Anthropic API key any time to unlock full Claude-powered replies." },
  { q: "Is my data private?", a: "Yes. You sign in and your content, deals, and fans are yours alone — never shared or used to train anything." },
];

export default function Landing() {
  return (
    <div className="relative overflow-hidden">
      {/* Nav */}
      <nav className="lp-nav">
        <div className="shell flex items-center justify-between py-4">
          <div className="brand"><span className="brand-mark" /> Halo</div>
          <div className="hidden gap-7 text-sm font-medium text-ink-2 md:flex">
            <a href="#meet" className="hover:text-ink">Meet Halo</a>
            <a href="#features" className="hover:text-ink">Features</a>
            <a href="#faq" className="hover:text-ink">FAQ</a>
          </div>
          <div className="flex items-center gap-2">
            <Link href="/login" className="btn-ghost">Sign in</Link>
            <Link href="/signup" className="btn-primary">Hire Halo — free</Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="shell grid items-center gap-12 py-14 md:grid-cols-2 md:py-20">
        <div>
          <div className="eyebrow fade-up d1">
            <span className="dot">✦</span>
            <span>meet your new manager — she works for ~$0.60/hr</span>
          </div>
          <h1 className="hero-title fade-up d2">
            Hi, I'm <span className="serif">Halo</span>.<br />
            I run the <span className="underline-ish">boring half</span><br />
            of your <span className="serif">creator life</span>.
          </h1>
          <p className="hero-sub fade-up d3 mt-6 max-w-lg text-lg text-ink-2">
            I'm an AI manager built for creators. I capture your ideas, schedule your posts,
            negotiate brand deals, chase invoices, and remember every superfan's name — so you
            can just make stuff. We start at "hi."
          </p>
          <div className="fade-up d4 mt-7 flex flex-wrap gap-3">
            <Link href="/signup" className="btn-primary text-base">
              Hire Halo — free <ArrowRight size={16} />
            </Link>
            <Link href="/login" className="btn-ghost text-base">
              <Play size={14} /> Sign in
            </Link>
          </div>
          <div className="fade-up d5 mt-7 text-sm text-muted">
            Try the demo — <span className="text-ink">demo@halo.app</span> · <span className="text-ink">halo1234</span>
          </div>
        </div>

        {/* Hero visual */}
        <div className="relative mx-auto aspect-square w-full max-w-md">
          <div className="blob" style={{ inset: "-8% -8% auto auto", width: "58%", height: "58%", background: "var(--c1c)", animation: "blobFloat 14s ease-in-out infinite" }} />
          <div className="blob" style={{ inset: "auto -8% -8% auto", width: "50%", height: "50%", background: "var(--c4c)", animation: "blobFloat 18s ease-in-out infinite reverse" }} />
          <div className="blob" style={{ inset: "18% auto auto -8%", width: "48%", height: "48%", background: "var(--c3c)", animation: "blobFloat 16s ease-in-out infinite" }} />
          <div className="absolute inset-0 flex items-center justify-center">
            <HaloPortrait size={240} showTag />
          </div>
          {heroBubbles.map((b, i) => (
            <div
              key={i}
              className={`chat-bubble ${b.side} ${b.small ? "small" : ""}`}
              style={{ top: b.top, animationDelay: `${b.delay}s` }}
            >
              {b.from && <div className="bubble-from">{b.from}</div>}
              <div className="bubble-text">{b.text}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Marquee */}
      <div className="marquee-strip">
        <div className="marquee-track">
          {[...marquee, ...marquee].map((t, i) => (
            <span key={i} className="marquee-item"><span className="star">✦</span>{t}</span>
          ))}
        </div>
      </div>

      {/* Meet Halo */}
      <MeetHalo />

      {/* Features */}
      <section id="features" className="shell py-20">
        <motion.div initial="hidden" whileInView="show" viewport={{ once: true }} variants={fadeUp}>
          <div className="sec-eyebrow">02 — what she does</div>
          <h2 className="sec-title">One manager for the <span className="serif">whole business</span> of being you.</h2>
        </motion.div>
        <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((f, i) => {
            const Icon = f.icon;
            return (
              <motion.div
                key={f.name}
                custom={i}
                initial="hidden"
                whileInView="show"
                viewport={{ once: true, margin: "-60px" }}
                variants={fadeUp}
                className="feat-card"
              >
                <div className="feat-icon" style={{ background: f.color }}><Icon size={20} /></div>
                <div className="feat-name">{f.name}</div>
                <div className="feat-h">{f.h}</div>
                <div className="feat-p">{f.p}</div>
              </motion.div>
            );
          })}
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="shell py-20">
        <motion.div initial="hidden" whileInView="show" viewport={{ once: true }} variants={fadeUp}>
          <div className="sec-eyebrow">03 — questions</div>
          <h2 className="sec-title">The <span className="serif">honest</span> answers.</h2>
        </motion.div>
        <div className="mx-auto mt-10 max-w-3xl border-t border-border">
          {faqs.map((f, i) => <Faq key={i} {...f} />)}
        </div>
      </section>

      {/* CTA */}
      <section className="shell py-16">
        <div className="cta-band">
          <div className="mx-auto mb-5 w-24"><HaloPortrait size={96} /></div>
          <h2 className="text-4xl font-semibold tracking-tight md:text-5xl">
            Ready to make stuff, <span className="serif">only</span>?
          </h2>
          <p className="mx-auto mt-3 max-w-md" style={{ color: "rgb(var(--bg) / 0.72)" }}>
            Hand Halo the boring half. She'll take it from here.
          </p>
          <Link href="/signup" className="btn-primary mt-6 text-base">
            Hire Halo — free <ArrowRight size={16} />
          </Link>
          <div className="serif mt-6 text-xl" style={{ opacity: 0.8 }}>— see you in there ✦</div>
        </div>
      </section>

      <footer className="border-t border-border py-8 text-center text-xs text-muted">
        Halo · your personal brand OS
      </footer>
    </div>
  );
}

function MeetHalo() {
  const [active, setActive] = useState(0);
  const m = moments[active];
  return (
    <section id="meet" className="shell py-20">
      <div className="sec-eyebrow">01 — meet halo</div>
      <h2 className="sec-title">She's <span className="serif">opinionated</span>, organized,<br />and fully <span className="serif">on your side</span>.</h2>
      <p className="sec-sub">
        Halo isn't a dashboard pretending to be helpful. She's an AI manager with a personality —
        a little sassy, deeply attentive, and obsessed with making your day easier. Tap a moment
        from her workday.
      </p>

      <div className="mt-12 grid items-center gap-10 md:grid-cols-2">
        <div className="flex flex-col gap-1">
          {moments.map((mo, i) => (
            <button key={i} className={`meet-tick ${i === active ? "on" : ""}`} onClick={() => setActive(i)}>
              <span className="t-time">{mo.time}</span>
              <span className="t-title">{mo.title}</span>
              <span className="t-vibe">{mo.vibe}</span>
            </button>
          ))}
        </div>

        <div className="relative flex min-h-[380px] items-center justify-center">
          <div className="blob" style={{ inset: "12%", background: m.color, opacity: 0.4, animation: "blobFloat 12s ease-in-out infinite" }} />
          <HaloPortrait size={200} />
          <div className="meet-bubble absolute right-0 top-[10%] max-w-[70%]" key={active}>
            <div className="bubble-from">Halo · {m.time}</div>
            <div className="mt-1 text-sm leading-relaxed">{m.msg}</div>
            <div className="mt-3 flex gap-2 border-t border-dashed border-border pt-3">
              <button className="btn-primary px-3 py-1 text-xs">{m.cta}</button>
              <button className="btn-ghost px-3 py-1 text-xs">later</button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function Faq({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div className={`faq-item ${open ? "open" : ""}`}>
      <button className="faq-q w-full text-left" onClick={() => setOpen(!open)}>
        {q} <span className="plus">+</span>
      </button>
      <div className="faq-a"><div><p>{a}</p></div></div>
    </div>
  );
}
