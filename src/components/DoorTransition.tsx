"use client";

import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  LayoutDashboard,
  Sparkles,
  CalendarDays,
  BarChart3,
  Handshake,
  Link2,
  MessageCircle,
  Settings,
  LucideIcon,
} from "lucide-react";
import HaloFace from "./HaloFace";

type Room = { label: string; icon: LucideIcon; a: string; b: string };

const ROOMS: Record<string, Room> = {
  "/dashboard": { label: "Dashboard", icon: LayoutDashboard, a: "--c1c", b: "--c3c" },
  "/studio": { label: "Content Studio", icon: Sparkles, a: "--c1c", b: "--c2c" },
  "/calendar": { label: "Calendar", icon: CalendarDays, a: "--c4c", b: "--c3c" },
  "/analytics": { label: "Analytics", icon: BarChart3, a: "--c5c", b: "--c4c" },
  "/deals": { label: "Deals & PR", icon: Handshake, a: "--c3c", b: "--c1c" },
  "/connections": { label: "Connections", icon: Link2, a: "--c4c", b: "--c5c" },
  "/chat": { label: "Halo Chat", icon: MessageCircle, a: "--c1c", b: "--c4c" },
  "/settings": { label: "Settings", icon: Settings, a: "--c2c", b: "--c1c" },
};

function roomFor(pathname: string): Room | null {
  const key = Object.keys(ROOMS).find((k) => pathname.startsWith(k));
  return key ? ROOMS[key] : null;
}

const DURATION = 1.2;

export default function DoorTransition() {
  const pathname = usePathname();
  const [anim, setAnim] = useState<{ id: number; room: Room } | null>(null);
  const first = useRef(true);
  const count = useRef(0);

  useEffect(() => {
    // don't play on the very first mount / hard refresh
    if (first.current) {
      first.current = false;
      return;
    }
    const room = roomFor(pathname);
    if (!room) return;
    count.current += 1;
    setAnim({ id: count.current, room });
    const t = setTimeout(() => setAnim(null), DURATION * 1000);
    return () => clearTimeout(t);
  }, [pathname]);

  return (
    <AnimatePresence>{anim && <DoorOverlay key={anim.id} room={anim.room} />}</AnimatePresence>
  );
}

function DoorOverlay({ room }: { room: Room }) {
  const Icon = room.icon;
  const grad = `linear-gradient(135deg, var(${room.a}), var(${room.b}))`;
  const times = [0, 0.32, 0.6, 1];

  return (
    <motion.div className="pointer-events-none fixed inset-0 z-[100]">
      {/* left door */}
      <motion.div
        className="absolute inset-y-0 left-0 w-1/2"
        style={{ background: grad, boxShadow: "8px 0 40px rgba(0,0,0,0.25)" }}
        initial={{ x: "-100%" }}
        animate={{ x: ["-100%", "0%", "0%", "-100%"] }}
        transition={{ duration: DURATION, times, ease: "easeInOut" }}
      >
        <DoorSlats side="left" />
      </motion.div>

      {/* right door */}
      <motion.div
        className="absolute inset-y-0 right-0 w-1/2"
        style={{ background: grad, boxShadow: "-8px 0 40px rgba(0,0,0,0.25)" }}
        initial={{ x: "100%" }}
        animate={{ x: ["100%", "0%", "0%", "100%"] }}
        transition={{ duration: DURATION, times, ease: "easeInOut" }}
      >
        <DoorSlats side="right" />
      </motion.div>

      {/* center seam light */}
      <motion.div
        className="absolute inset-y-0 left-1/2 w-[2px] -translate-x-1/2"
        style={{ background: "rgba(255,255,255,0.7)", filter: "blur(1px)" }}
        initial={{ opacity: 0 }}
        animate={{ opacity: [0, 0.9, 0.9, 0] }}
        transition={{ duration: DURATION, times, ease: "easeInOut" }}
      />

      {/* Halo walking through + room label */}
      <motion.div
        className="absolute inset-0 flex flex-col items-center justify-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: [0, 1, 1, 0] }}
        transition={{ duration: DURATION, times: [0, 0.34, 0.62, 0.82], ease: "easeInOut" }}
      >
        <motion.div
          initial={{ y: 150, scale: 0.65, opacity: 0 }}
          animate={{ y: [150, 4, -8, -170], scale: [0.65, 1, 1, 0.9], opacity: [0, 1, 1, 0] }}
          transition={{ duration: DURATION, times: [0, 0.42, 0.62, 1], ease: "easeInOut" }}
        >
          <div
            className="halo-portrait"
            style={{ width: 96, height: 96, boxShadow: "0 24px 60px rgba(0,0,0,0.3)" }}
          >
            <div style={{ width: "88%", height: "88%", borderRadius: "50%", overflow: "hidden" }}>
              <HaloFace />
            </div>
          </div>
        </motion.div>
        <div className="mt-5 flex items-center gap-2 text-white drop-shadow">
          <Icon size={18} />
          <span className="text-lg font-semibold tracking-tight">{room.label}</span>
        </div>
      </motion.div>
    </motion.div>
  );
}

// subtle vertical paneling on each door for depth
function DoorSlats({ side }: { side: "left" | "right" }) {
  return (
    <div className="absolute inset-0 overflow-hidden">
      <div
        className="absolute inset-0"
        style={{
          background:
            "repeating-linear-gradient(90deg, rgba(255,255,255,0.06) 0 1px, transparent 1px 64px)",
        }}
      />
      {/* handle near the seam */}
      <div
        className="absolute top-1/2 h-16 w-1.5 -translate-y-1/2 rounded-full bg-white/40"
        style={{ [side === "left" ? "right" : "left"]: 18 } as React.CSSProperties}
      />
    </div>
  );
}
