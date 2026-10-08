function XMark({ size = 28, inkColor = "#0B1222" }) {
  return (
    <svg width={size} height={size} viewBox="0 0 256 256" aria-hidden="true">
      <line x1="190" y1="62" x2="62" y2="190" stroke={inkColor} strokeWidth="38" strokeLinecap="round" />
      <line x1="62" y1="62" x2="190" y2="190" stroke={inkColor} strokeWidth="38" strokeLinecap="round" />
      <circle cx="202" cy="50" r="17" fill="#FFB020" />
    </svg>
  );
}

export default function Logo({ size = 28, className = "", inkColor = "#0B1222" }) {
  return (
    <span className={`inline-flex items-center gap-[0.12em] font-extrabold tracking-tight ${className}`} style={{ fontSize: size }}>
      PONCO
      <XMark size={size * 0.9} inkColor={inkColor} />
    </span>
  );
}
