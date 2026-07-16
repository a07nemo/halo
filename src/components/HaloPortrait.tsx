"use client";

import HaloFace from "./HaloFace";

/**
 * Halo's face inside her signature rainbow-ring portrait, with glow
 * and an optional "online" name tag.
 */
export default function HaloPortrait({
  size = 120,
  showTag = false,
  glow = true,
}: {
  size?: number;
  showTag?: boolean;
  glow?: boolean;
}) {
  return (
    <div
      className="halo-portrait"
      style={{ width: size, height: size, boxShadow: "0 24px 60px rgb(var(--ink) / 0.14)" }}
    >
      {glow && <div className="halo-glow" />}
      <div style={{ width: "88%", height: "88%", borderRadius: "50%", overflow: "hidden" }}>
        <HaloFace />
      </div>
      {showTag && (
        <div
          className="pill"
          style={{
            position: "absolute",
            bottom: -8,
            left: "50%",
            transform: "translateX(-50%)",
            background: "var(--inkc)",
            color: "var(--bgc)",
            fontWeight: 600,
            whiteSpace: "nowrap",
            boxShadow: "0 8px 24px rgb(var(--ink) / 0.18)",
          }}
        >
          <span className="status-dot" /> Halo · online
        </div>
      )}
    </div>
  );
}
