"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import HaloPortrait from "./HaloPortrait";

export default function HaloGreeting({
  name,
  stats,
}: {
  name: string;
  stats: { openDeliverables: number; activeDeals: number; scheduledPosts: number };
}) {
  const first = name?.split(" ")[0] || "there";
  const message = composeMessage(first, stats);

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="card relative mb-6 overflow-hidden p-5"
    >
      <div className="absolute -right-10 -top-10 h-40 w-40 rounded-full bg-halo-600/10 blur-3xl" />
      <div className="relative flex items-center gap-4">
        <div className="shrink-0"><HaloPortrait size={56} /></div>
        <div className="flex-1">
          <div className="text-xs font-semibold uppercase tracking-wide text-c1">Halo</div>
          <p className="mt-0.5 text-sm text-ink">{message}</p>
        </div>
        <Link href="/chat" className="btn-ghost hidden shrink-0 sm:inline-flex">
          Ask Halo <ArrowRight size={14} />
        </Link>
      </div>
    </motion.div>
  );
}

function composeMessage(
  name: string,
  stats: { openDeliverables: number; activeDeals: number; scheduledPosts: number }
) {
  const bits: string[] = [];
  if (stats.openDeliverables > 0) {
    bits.push(`you've got ${stats.openDeliverables} deliverable${stats.openDeliverables > 1 ? "s" : ""} in motion`);
  }
  if (stats.activeDeals > 0) {
    bits.push(`${stats.activeDeals} active deal${stats.activeDeals > 1 ? "s" : ""}`);
  }
  if (stats.scheduledPosts > 0) {
    bits.push(`${stats.scheduledPosts} post${stats.scheduledPosts > 1 ? "s" : ""} scheduled`);
  }

  if (bits.length === 0) {
    return `Hey ${name} — a clear runway today. Want to brainstorm your next post together?`;
  }
  return `Hey ${name} — ${joinNicely(bits)}. Want me to help you knock something out?`;
}

function joinNicely(arr: string[]) {
  if (arr.length === 1) return arr[0];
  if (arr.length === 2) return `${arr[0]} and ${arr[1]}`;
  return `${arr.slice(0, -1).join(", ")}, and ${arr[arr.length - 1]}`;
}
