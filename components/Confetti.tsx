const COLORS = ["#c9a45c", "#e6cc92", "#6fa8a4", "#b8606d", "#8b97c9", "#f1ece2"];

// Fixed layout (no randomness) so it renders identically everywhere.
const pieces = Array.from({ length: 36 }, (_, i) => ({
  left: (i * 37) % 100,
  delay: ((i * 13) % 10) / 10,
  duration: 2 + ((i * 7) % 12) / 10,
  size: 6 + ((i * 5) % 7),
  color: COLORS[i % COLORS.length],
  rotate: (i * 47) % 360,
}));

/** A short burst of falling confetti. Purely decorative. */
export default function Confetti() {
  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 z-[60] overflow-hidden">
      {pieces.map((piece, i) => (
        <span
          key={i}
          className="confetti-piece"
          style={{
            left: `${piece.left}%`,
            width: piece.size,
            height: piece.size * 0.5,
            background: piece.color,
            animationDelay: `${piece.delay}s`,
            animationDuration: `${piece.duration}s`,
            transform: `rotate(${piece.rotate}deg)`,
          }}
        />
      ))}
    </div>
  );
}
