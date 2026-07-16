"use client";

import { useEffect, useRef, useState } from "react";

/**
 * A living cursor: a soft halo ring that trails the mouse and morphs into
 * a sparkle over anything interactive. Desktop / fine-pointer only.
 */
export default function HaloCursor() {
  const dot = useRef<HTMLDivElement>(null);
  const ring = useRef<HTMLDivElement>(null);
  const [enabled, setEnabled] = useState(false);
  const [hover, setHover] = useState(false);
  const [down, setDown] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (!window.matchMedia("(pointer: fine)").matches) return;
    setEnabled(true);
    document.body.classList.add("halo-cursor-on");

    const pos = { x: window.innerWidth / 2, y: window.innerHeight / 2 };
    const ringPos = { ...pos };
    let raf = 0;

    const onMove = (e: MouseEvent) => {
      pos.x = e.clientX;
      pos.y = e.clientY;
      const el = e.target as HTMLElement | null;
      setHover(Boolean(el && el.closest("a, button, [data-cursor]")));
    };
    const onDown = () => setDown(true);
    const onUp = () => setDown(false);

    const loop = () => {
      ringPos.x += (pos.x - ringPos.x) * 0.2;
      ringPos.y += (pos.y - ringPos.y) * 0.2;
      if (dot.current) dot.current.style.transform = `translate(${pos.x}px, ${pos.y}px) translate(-50%, -50%)`;
      if (ring.current) ring.current.style.transform = `translate(${ringPos.x}px, ${ringPos.y}px) translate(-50%, -50%)`;
      raf = requestAnimationFrame(loop);
    };

    window.addEventListener("mousemove", onMove);
    window.addEventListener("mousedown", onDown);
    window.addEventListener("mouseup", onUp);
    raf = requestAnimationFrame(loop);

    return () => {
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mousedown", onDown);
      window.removeEventListener("mouseup", onUp);
      cancelAnimationFrame(raf);
      document.body.classList.remove("halo-cursor-on");
    };
  }, []);

  if (!enabled) return null;

  return (
    <>
      <div ref={ring} className={`halo-cur-ring${hover ? " is-hover" : ""}${down ? " is-down" : ""}`}>
        <span className="halo-cur-spark">✦</span>
      </div>
      <div ref={dot} className={`halo-cur-dot${hover ? " is-hover" : ""}`} />
    </>
  );
}
