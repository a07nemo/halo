"use client";

import { motion } from "framer-motion";

/**
 * Halo's visual presence — a living, breathing orb.
 * Used across the app as the assistant's "face".
 */
export default function HaloAvatar({
  size = 96,
  speaking = false,
}: {
  size?: number;
  speaking?: boolean;
}) {
  const rings = [0, 1, 2];
  return (
    <div
      className="relative flex items-center justify-center"
      style={{ width: size, height: size }}
      aria-label="Halo"
    >
      {/* pulsing halo rings */}
      {rings.map((i) => (
        <motion.span
          key={i}
          className="absolute rounded-full border border-halo-400/40"
          style={{ width: size, height: size }}
          initial={{ scale: 0.7, opacity: 0.6 }}
          animate={{ scale: [0.7, 1.35], opacity: [0.5, 0] }}
          transition={{
            duration: 3,
            repeat: Infinity,
            delay: i * 1,
            ease: "easeOut",
          }}
        />
      ))}

      {/* rotating gradient aura */}
      <motion.div
        className="absolute rounded-full blur-md"
        style={{
          width: size * 0.9,
          height: size * 0.9,
          background:
            "conic-gradient(from 0deg, #a78bfa, #22d3ee, #ec4899, #a78bfa)",
        }}
        animate={{ rotate: 360 }}
        transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
      />

      {/* core orb */}
      <motion.div
        className="relative rounded-full bg-gradient-to-br from-halo-300 to-accent shadow-glow"
        style={{ width: size * 0.62, height: size * 0.62 }}
        animate={
          speaking
            ? { scale: [1, 1.08, 0.96, 1.05, 1] }
            : { scale: [1, 1.05, 1] }
        }
        transition={{
          duration: speaking ? 0.9 : 3.5,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      >
        {/* inner glow highlight */}
        <div
          className="absolute rounded-full bg-white/70 blur-[2px]"
          style={{ width: size * 0.14, height: size * 0.14, top: size * 0.12, left: size * 0.16 }}
        />
      </motion.div>
    </div>
  );
}
