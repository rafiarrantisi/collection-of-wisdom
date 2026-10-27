interface SprigProps {
  className?: string;
  leaves?: number;
  flip?: boolean;
}

/** Fine botanical line-art: a curved stem with alternating leaves. Purely decorative. */
export function Sprig({ className, leaves = 7, flip = false }: SprigProps) {
  const pts = Array.from({ length: leaves }, (_, i) => {
    const t = (i + 1) / (leaves + 1);
    // point on quadratic curve (10,190) -> ctrl (70,110) -> (40,10)
    const x = (1 - t) ** 2 * 10 + 2 * (1 - t) * t * 70 + t ** 2 * 40;
    const y = (1 - t) ** 2 * 190 + 2 * (1 - t) * t * 110 + t ** 2 * 10;
    const side = i % 2 === 0 ? 1 : -1;
    const angle = side * (38 - t * 14) - 20 * t;
    const len = 26 - t * 12;
    return { x, y, angle, len };
  });
  return (
    <svg
      className={className}
      viewBox="0 0 100 200"
      aria-hidden="true"
      focusable="false"
      style={flip ? { transform: 'scaleX(-1)' } : undefined}
    >
      <path d="M10 190 Q70 110 40 10" fill="none" stroke="currentColor" strokeWidth="0.9" strokeLinecap="round" />
      {pts.map((p, i) => (
        <path
          key={i}
          d={`M0 0 C ${p.len * 0.35} ${-p.len * 0.32}, ${p.len * 0.8} ${-p.len * 0.25}, ${p.len} 0 C ${p.len * 0.8} ${p.len * 0.22}, ${p.len * 0.35} ${p.len * 0.26}, 0 0 Z M0 0 L ${p.len * 0.85} 0`}
          transform={`translate(${p.x} ${p.y}) rotate(${p.angle - 90})`}
          fill="none"
          stroke="currentColor"
          strokeWidth="0.7"
          strokeLinejoin="round"
        />
      ))}
      <circle cx="40" cy="10" r="2.2" fill="none" stroke="currentColor" strokeWidth="0.7" />
    </svg>
  );
}
