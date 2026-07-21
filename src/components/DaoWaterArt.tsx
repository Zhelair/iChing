export function DaoWaterArt() {
  return (
    <svg className="dao-water-art" viewBox="0 0 640 420" aria-hidden="true">
      <defs>
        <linearGradient id="dao-water" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="currentColor" stopOpacity=".08" />
          <stop offset=".55" stopColor="currentColor" stopOpacity=".42" />
          <stop offset="1" stopColor="currentColor" stopOpacity=".08" />
        </linearGradient>
      </defs>
      <path className="dao-water-art__mountain" d="M-20 290C90 192 148 187 218 242c58 46 93 32 146-30 61-72 136-67 296 55v173H-20Z" />
      <path className="dao-water-art__stream" d="M-12 119c92 2 152 25 191 68 50 55 79 91 170 83 116-11 119-86 301-108" />
      <path className="dao-water-art__stream dao-water-art__stream--fine" d="M-16 150c97-5 144 20 185 65 58 63 96 90 189 72 120-24 129-95 296-103" />
      <g className="dao-water-art__rings" fill="none">
        <ellipse cx="443" cy="247" rx="64" ry="18" />
        <ellipse cx="443" cy="247" rx="96" ry="29" />
        <ellipse cx="443" cy="247" rx="133" ry="41" />
      </g>
    </svg>
  )
}
