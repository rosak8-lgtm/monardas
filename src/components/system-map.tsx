export function SystemMap() {
  return (
    <div className="system-map">
      <div className="map-top">
        <span>THE MONARDAS MODEL</span>
        <span>01 — ∞</span>
      </div>
      <svg viewBox="0 0 520 460" fill="none" aria-hidden="true">
        <defs>
          <pattern
            id="grid"
            width="40"
            height="40"
            patternUnits="userSpaceOnUse"
          >
            <path d="M 40 0 L 0 0 0 40" stroke="currentColor" opacity=".08" />
          </pattern>
        </defs>
        <rect width="520" height="460" fill="url(#grid)" />
        <g stroke="currentColor" strokeWidth="1">
          <ellipse cx="275" cy="230" rx="160" ry="160" opacity=".18" />
          <ellipse cx="275" cy="230" rx="112" ry="112" opacity=".25" />
          <path
            d="M20 70C160 70 100 230 275 230M20 150C130 150 160 230 275 230M20 310C130 310 160 230 275 230M20 390C160 390 100 230 275 230"
            opacity=".45"
          />
          <path
            d="M275 230H475M275 230C380 230 350 100 475 100M275 230C380 230 350 360 475 360"
            stroke="#B89B5E"
          />
          <path
            d="M275 48V412M94 230H455"
            strokeDasharray="3 7"
            opacity=".25"
          />
        </g>
        {[
          [20, 70],
          [20, 150],
          [20, 310],
          [20, 390],
          [475, 100],
          [475, 230],
          [475, 360],
        ].map(([cx, cy]) => (
          <circle key={`${cx}-${cy}`} cx={cx} cy={cy} r="4" fill="#758077" />
        ))}
        <circle cx="275" cy="230" r="28" fill="#171713" stroke="#B89B5E" />
        <path
          d="M264 241V219L275 232L286 219V241"
          stroke="#F3F0E8"
          strokeWidth="1.5"
        />
        <text
          x="275"
          y="438"
          textAnchor="middle"
          fill="currentColor"
          fontSize="10"
          letterSpacing="3"
        >
          STRUCTURE CREATES VALUE
        </text>
      </svg>
      <div className="map-bottom">
        <span>Friction</span>
        <span>System</span>
        <span>Asset ↗</span>
      </div>
    </div>
  );
}
