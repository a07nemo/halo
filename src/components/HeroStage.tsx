"use client";

import { useRef, useState } from "react";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { Film, DollarSign, Heart } from "lucide-react";
import HaloPortrait from "./HaloPortrait";

/**
 * The hero centerpiece: Halo's portrait whose eyes follow the cursor,
 * surrounded by floating creator artifacts that drift with mouse parallax.
 */
export default function HeroStage() {
  const wrap = useRef<HTMLDivElement>(null);
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const smx = useSpring(mx, { stiffness: 45, damping: 15 });
  const smy = useSpring(my, { stiffness: 45, damping: 15 });
  const [eye, setEye] = useState({ x: 0, y: 0 });

  // parallax layers (declared at top level per hook rules)
  const px = useTransform(smx, (v) => v * 10);
  const py = useTransform(smy, (v) => v * 10);
  const c1x = useTransform(smx, (v) => v * 34);
  const c1y = useTransform(smy, (v) => v * 34);
  const c2x = useTransform(smx, (v) => v * -26);
  const c2y = useTransform(smy, (v) => v * -26);
  const c3x = useTransform(smx, (v) => v * 22);
  const c3y = useTransform(smy, (v) => v * 22);
  const b1x = useTransform(smx, (v) => v * -16);
  const b1y = useTransform(smy, (v) => v * -16);

  const onMove = (e: React.MouseEvent) => {
    const r = wrap.current?.getBoundingClientRect();
    if (!r) return;
    const nx = (e.clientX - (r.left + r.width / 2)) / (r.width / 2);
    const ny = (e.clientY - (r.top + r.height / 2)) / (r.height / 2);
    const cx = Math.max(-1, Math.min(1, nx));
    const cy = Math.max(-1, Math.min(1, ny));
    mx.set(cx);
    my.set(cy);
    const len = Math.hypot(cx, cy) || 1;
    const mag = Math.min(1, len) * 4.2;
    setEye({ x: (cx / len) * mag, y: (cy / len) * mag });
  };
  const onLeave = () => {
    mx.set(0);
    my.set(0);
    setEye({ x: 0, y: 0 });
  };

  return (
    <div
      ref={wrap}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
      className="relative mx-auto aspect-square w-full max-w-md"
    >
      {/* theme-tinted blobs */}
      <div className="blob" style={{ inset: "-8% -8% auto auto", width: "58%", height: "58%", background: "var(--c1c)", animation: "blobFloat 14s ease-in-out infinite" }} />
      <div className="blob" style={{ inset: "auto -8% -8% auto", width: "50%", height: "50%", background: "var(--c4c)", animation: "blobFloat 18s ease-in-out infinite reverse" }} />
      <div className="blob" style={{ inset: "18% auto auto -8%", width: "48%", height: "48%", background: "var(--c3c)", animation: "blobFloat 16s ease-in-out infinite" }} />

      {/* portrait with gaze */}
      <motion.div style={{ x: px, y: py }} className="absolute inset-0 flex items-center justify-center">
        <HaloPortrait size={244} showTag eye={eye} />
      </motion.div>

      {/* floating artifact: reel */}
      <motion.div
        style={{ x: c1x, y: c1y }}
        className="card absolute left-0 top-[8%] flex items-center gap-2 p-2.5 text-xs"
        data-cursor
      >
        <span className="flex h-7 w-7 items-center justify-center rounded-lg text-white" style={{ background: "var(--c1c)" }}>
          <Film size={14} />
        </span>
        <div>
          <div className="font-semibold text-ink">Launch reel</div>
          <div className="text-muted">due in 2 days</div>
        </div>
      </motion.div>

      {/* floating artifact: brand deal */}
      <motion.div
        style={{ x: c2x, y: c2y }}
        className="card absolute right-0 top-[30%] flex items-center gap-2 p-2.5 text-xs"
        data-cursor
      >
        <span className="flex h-7 w-7 items-center justify-center rounded-lg text-white" style={{ background: "var(--c5c)" }}>
          <DollarSign size={14} />
        </span>
        <div>
          <div className="font-semibold text-ink">Glow Botanics</div>
          <div className="text-muted">$6.5k · active</div>
        </div>
      </motion.div>

      {/* floating artifact: fans */}
      <motion.div
        style={{ x: c3x, y: c3y }}
        className="card absolute bottom-[6%] left-[10%] flex items-center gap-2 p-2.5 text-xs"
        data-cursor
      >
        <span className="flex h-7 w-7 items-center justify-center rounded-lg text-white" style={{ background: "var(--c3c)" }}>
          <Heart size={14} />
        </span>
        <div>
          <div className="font-semibold text-ink">+612 fans</div>
          <div className="text-muted">this week</div>
        </div>
      </motion.div>

      {/* a drifting chat whisper */}
      <motion.div
        style={{ x: b1x, y: b1y, background: "linear-gradient(135deg, var(--c1c), var(--c3c))" }}
        className="absolute bottom-[22%] right-[4%] max-w-[54%] rounded-2xl rounded-br-sm px-3 py-2 text-xs text-white shadow-md"
        data-cursor
      >
        morning ✦ I sorted your inbox
      </motion.div>
    </div>
  );
}
