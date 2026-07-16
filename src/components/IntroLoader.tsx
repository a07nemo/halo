"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

/**
 * A ~2s branded intro: Halo's ring draws itself, her name fades in, then lifts away.
 * Shows once per browser-tab session.
 */
export default function IntroLoader() {
  const [show, setShow] = useState(true);

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (sessionStorage.getItem("halo_intro_seen")) {
      setShow(false);
      return;
    }
    const t = setTimeout(() => {
      setShow(false);
      sessionStorage.setItem("halo_intro_seen", "1");
    }, 2000);
    return () => clearTimeout(t);
  }, []);

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          className="fixed inset-0 z-[200] flex flex-col items-center justify-center"
          style={{ background: "var(--bgc)" }}
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, transition: { duration: 0.6, ease: "easeInOut" } }}
        >
          <svg width="132" height="132" viewBox="0 0 132 132">
            <defs>
              <linearGradient id="introRing" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%" stopColor="var(--c1c)" />
                <stop offset="50%" stopColor="var(--c3c)" />
                <stop offset="100%" stopColor="var(--c4c)" />
              </linearGradient>
            </defs>
            <motion.circle
              cx="66"
              cy="66"
              r="52"
              fill="none"
              stroke="url(#introRing)"
              strokeWidth="4"
              strokeLinecap="round"
              transform="rotate(-90 66 66)"
              initial={{ pathLength: 0, opacity: 0.3 }}
              animate={{ pathLength: 1, opacity: 1 }}
              transition={{ duration: 1.3, ease: "easeInOut" }}
            />
            <motion.circle
              cx="66"
              cy="66"
              r="20"
              fill="var(--c1c)"
              initial={{ scale: 0 }}
              animate={{ scale: [0, 1.15, 1] }}
              transition={{ delay: 0.9, duration: 0.7, ease: "easeOut" }}
              style={{ transformOrigin: "66px 66px" }}
            />
          </svg>
          <motion.div
            className="mt-6 text-2xl font-semibold tracking-tight"
            style={{ color: "var(--inkc)" }}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.1, duration: 0.5 }}
          >
            Halo
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
