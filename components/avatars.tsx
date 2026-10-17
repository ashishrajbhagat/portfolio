import type { ReactElement } from "react";
import type { ProfileSlug } from "@/content/types";

const svgProps = {
  viewBox: "0 0 200 200",
  xmlns: "http://www.w3.org/2000/svg",
  className: "block h-full w-full",
  "aria-hidden": true,
} as const;

/** Recruiter: amber, clapperboard stripes, round glasses. */
export function RecruiterAvatar() {
  return (
    <svg {...svgProps}>
      <rect width="200" height="200" fill="#f5b301" />
      <rect width="200" height="36" fill="#1b1405" />
      {[0, 56, 112, 168].map((x) => (
        <path key={x} d={`M${x} 36 L${x + 26} 0 H${x + 52} L${x + 26} 36 Z`} fill="#f5b301" opacity="0.95" />
      ))}
      <circle cx="68" cy="98" r="21" fill="#fff6d6" stroke="#1b1405" strokeWidth="6" />
      <circle cx="132" cy="98" r="21" fill="#fff6d6" stroke="#1b1405" strokeWidth="6" />
      <path d="M89 96 H111" stroke="#1b1405" strokeWidth="6" strokeLinecap="round" />
      <circle cx="70" cy="100" r="7" fill="#1b1405" />
      <circle cx="130" cy="100" r="7" fill="#1b1405" />
      <path d="M62 146 Q100 180 138 146" fill="none" stroke="#1b1405" strokeWidth="8" strokeLinecap="round" />
    </svg>
  );
}

/** Developer: terminal green, `>` and blinking `_` eyes. */
export function DeveloperAvatar() {
  return (
    <svg {...svgProps}>
      <rect width="200" height="200" fill="#07180f" />
      {Array.from({ length: 20 }).map((_, i) => (
        <rect key={i} y={i * 10} width="200" height="1" fill="#39ff88" opacity="0.07" />
      ))}
      <path d="M46 70 L84 96 L46 122" fill="none" stroke="#39ff88" strokeWidth="12" strokeLinecap="round" strokeLinejoin="round" />
      <rect className="blink" x="114" y="112" width="42" height="12" rx="3" fill="#39ff88" />
      <path d="M62 152 Q100 180 138 152" fill="none" stroke="#39ff88" strokeWidth="8" strokeLinecap="round" />
    </svg>
  );
}

/** Explorer: deep violet sky, ringed planet with a smiley face. */
export function ExplorerAvatar() {
  const stars: Array<[number, number, number]> = [
    [24, 30, 2.5], [170, 24, 2], [150, 60, 1.5], [30, 150, 2], [176, 150, 2.5], [60, 20, 1.5], [18, 90, 1.5], [184, 100, 1.5],
  ];
  return (
    <svg {...svgProps}>
      <defs>
        <linearGradient id="explorer-sky" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#1a1450" />
          <stop offset="1" stopColor="#3b2a9c" />
        </linearGradient>
      </defs>
      <rect width="200" height="200" fill="url(#explorer-sky)" />
      {stars.map(([x, y, r]) => (
        <circle key={`${x}-${y}`} cx={x} cy={y} r={r} fill="#fff" opacity="0.85" />
      ))}
      <g transform="rotate(-18 100 108)">
        <ellipse cx="100" cy="108" rx="86" ry="22" fill="none" stroke="#cdbfff" strokeWidth="5" />
        <circle cx="100" cy="108" r="56" fill="#8b7bff" />
        <path d="M14 108 A86 22 0 0 0 186 108" fill="none" stroke="#cdbfff" strokeWidth="5" />
      </g>
      <circle cx="80" cy="98" r="9" fill="#fff" />
      <circle cx="120" cy="98" r="9" fill="#fff" />
      <circle cx="82" cy="100" r="4" fill="#1a1450" />
      <circle cx="118" cy="100" r="4" fill="#1a1450" />
      <path d="M82 124 Q100 140 118 124" fill="none" stroke="#1a1450" strokeWidth="6" strokeLinecap="round" />
    </svg>
  );
}

export function AddAvatar() {
  return (
    <svg {...svgProps}>
      <rect width="200" height="200" fill="#2a2a2a" />
      <path d="M100 66 V134 M66 100 H134" stroke="#8c8c8c" strokeWidth="12" strokeLinecap="round" />
    </svg>
  );
}

export const avatarBySlug: Record<ProfileSlug, () => ReactElement> = {
  recruiter: RecruiterAvatar,
  developer: DeveloperAvatar,
  explorer: ExplorerAvatar,
};
