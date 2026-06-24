interface LogoProps {
  color?: string;
  accentColor?: string;
  width?: number;
}

export function Logo({ color = "#2C1A0E", accentColor = "#C9A84C", width = 220 }: LogoProps) {
  const h = width * 0.58;
  return (
    <svg
      width={width}
      height={h}
      viewBox="0 0 340 200"
      xmlns="http://www.w3.org/2000/svg"
      style={{ display: "block", overflow: "visible" }}
    >
      <text
        x="30"
        y="80"
        fontFamily="'Dancing Script',cursive"
        fontSize="82"
        fontWeight="600"
        fill={color}
        letterSpacing="-1"
      >
        disenyo
      </text>
      <path
        d="M 188,82 C 192,100 192,118 186,138 C 180,156 166,170 148,180 C 130,190 108,194 88,190 C 68,186 52,174 46,160 C 40,148 44,136 54,130 C 62,125 72,127 78,135 C 82,141 80,150 74,154 C 68,158 60,155 56,149"
        stroke={accentColor}
        strokeWidth="3.5"
        fill="none"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M 46,160 C 38,152 36,140 44,132 C 50,126 62,128 66,138"
        stroke={accentColor}
        strokeWidth="2.5"
        fill="none"
        strokeLinecap="round"
      />
      <text x="178" y="168" fontFamily="'DM Sans',sans-serif" fill={color}>
        <tspan fontSize="38" fontWeight="300">di</tspan>
        <tspan fontSize="46" fontWeight="700" dy="-2">GI</tspan>
        <tspan fontSize="38" fontWeight="400" dy="2">TALs</tspan>
      </text>
    </svg>
  );
}
