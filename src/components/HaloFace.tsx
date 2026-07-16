"use client";

/**
 * Halo — a stylized, friendly female persona (original take).
 * Warm face, flowing hair, a glowing halo ring, blinking eyes, and sparkles.
 * Colors pull from the active theme via CSS variables.
 */
export default function HaloFace({ className = "" }: { className?: string }) {
  return (
    <svg
      className={`halo-face-svg ${className}`}
      viewBox="0 0 220 240"
      xmlns="http://www.w3.org/2000/svg"
      style={{ width: "100%", height: "100%" }}
    >
      <defs>
        <linearGradient id="haloRing" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="var(--c2c)" />
          <stop offset="100%" stopColor="var(--c1c)" />
        </linearGradient>
        <linearGradient id="hairGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="var(--c3c)" />
          <stop offset="100%" stopColor="var(--c4c)" />
        </linearGradient>
        <linearGradient id="skinGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#F7CDB0" />
          <stop offset="100%" stopColor="#EBAF8B" />
        </linearGradient>
        <radialGradient id="cheek">
          <stop offset="0%" stopColor="#FF8AA8" stopOpacity="0.65" />
          <stop offset="100%" stopColor="#FF8AA8" stopOpacity="0" />
        </radialGradient>
        <radialGradient id="bgGlow">
          <stop offset="0%" stopColor="var(--c1c)" stopOpacity="0.22" />
          <stop offset="100%" stopColor="var(--c1c)" stopOpacity="0" />
        </radialGradient>
      </defs>

      {/* soft backdrop */}
      <circle cx="110" cy="122" r="108" fill="url(#bgGlow)" />

      {/* halo ring above the head */}
      <ellipse cx="110" cy="34" rx="46" ry="9" fill="none" stroke="url(#haloRing)" strokeWidth="7" opacity="0.35" />
      <ellipse cx="110" cy="34" rx="46" ry="9" fill="none" stroke="url(#haloRing)" strokeWidth="3.5" />

      {/* hair back */}
      <path
        d="M42 132 C 42 62, 82 40, 110 40 C 138 40, 178 62, 178 132 L 172 204 C 168 220, 152 222, 148 202 L 148 150 C 148 150, 142 166, 110 166 C 78 166, 72 150, 72 150 L 72 202 C 68 222, 52 220, 48 204 Z"
        fill="url(#hairGrad)"
      />

      {/* face */}
      <ellipse cx="110" cy="126" rx="47" ry="57" fill="url(#skinGrad)" />

      {/* neck */}
      <path d="M93 176 L 93 196 L 127 196 L 127 176 Z" fill="url(#skinGrad)" />

      {/* bangs */}
      <path
        d="M63 98 C 82 62, 138 62, 157 98 C 157 108, 144 98, 129 103 C 119 94, 96 94, 86 106 C 76 101, 63 106, 63 98 Z"
        fill="url(#hairGrad)"
      />

      {/* cheeks */}
      <ellipse cx="83" cy="140" rx="11" ry="7" fill="url(#cheek)" />
      <ellipse cx="137" cy="140" rx="11" ry="7" fill="url(#cheek)" />

      {/* eyes */}
      <g className="eyes">
        <ellipse cx="93" cy="124" rx="3.6" ry="5.2" fill="#241826" />
        <ellipse cx="127" cy="124" rx="3.6" ry="5.2" fill="#241826" />
        <circle cx="94.2" cy="122" r="1.2" fill="#fff" />
        <circle cx="128.2" cy="122" r="1.2" fill="#fff" />
      </g>

      {/* brows */}
      <path d="M85 112 Q 93 109 101 113" stroke="#241826" strokeWidth="2" fill="none" strokeLinecap="round" />
      <path d="M119 113 Q 127 109 135 112" stroke="#241826" strokeWidth="2" fill="none" strokeLinecap="round" />

      {/* smile */}
      <path d="M99 152 Q 110 160 121 152" stroke="#241826" strokeWidth="2.4" fill="none" strokeLinecap="round" />

      {/* sparkles */}
      <g className="sparkles">
        <path d="M168 72 l2 6 l6 2 l-6 2 l-2 6 l-2 -6 l-6 -2 l6 -2 z" fill="var(--c2c)" />
        <path d="M50 82 l1.5 4 l4 1.5 l-4 1.5 l-1.5 4 l-1.5 -4 l-4 -1.5 l4 -1.5 z" fill="var(--c3c)" />
        <path d="M182 158 l1.5 4 l4 1.5 l-4 1.5 l-1.5 4 l-1.5 -4 l-4 -1.5 l4 -1.5 z" fill="var(--c4c)" />
      </g>
    </svg>
  );
}
