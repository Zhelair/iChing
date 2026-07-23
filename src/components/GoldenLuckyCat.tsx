type Props = { motion: boolean; phase: 'ready' | 'running' | 'paused' | 'complete' }

export function GoldenLuckyCat({ motion, phase }: Props) {
  const moving = motion && phase === 'running'
  return <svg className={`golden-lucky-cat ${moving ? 'is-moving' : ''} golden-lucky-cat--${phase}`} viewBox="0 0 260 280" role="img" aria-label="Golden waving lucky cat">
    <defs>
      <linearGradient id="lucky-fur" x1="20%" y1="0" x2="78%" y2="100%"><stop offset="0" stopColor="#f5c875" /><stop offset=".46" stopColor="#d99a45" /><stop offset="1" stopColor="#a9632b" /></linearGradient>
      <linearGradient id="lucky-light" x1="15%" y1="0" x2="85%" y2="100%"><stop offset="0" stopColor="#ffe0a0" /><stop offset="1" stopColor="#c67b35" /></linearGradient>
      <linearGradient id="lucky-ear" x1="0" y1="0" x2="1" y2="1"><stop stopColor="#f27958" /><stop offset="1" stopColor="#d34435" /></linearGradient>
      <filter id="lucky-shadow" x="-30%" y="-30%" width="170%" height="180%"><feDropShadow dx="0" dy="8" stdDeviation="6" floodColor="#7a4a28" floodOpacity=".22" /></filter>
    </defs>
    <ellipse className="golden-lucky-cat__shadow" cx="130" cy="257" rx="83" ry="12" />
    <g className="golden-lucky-cat__character" filter="url(#lucky-shadow)">
      <path className="golden-lucky-cat__tail" d="M80 205c-36 8-61-13-55-42 4-23 25-37 46-31 19 5 28 24 20 41-6 12-20 18-33 13" fill="none" stroke="url(#lucky-fur)" strokeWidth="20" strokeLinecap="round" />
      <path className="golden-lucky-cat__tail-light" d="M72 205c-18 3-34-7-36-21-2-11 4-22 14-27" fill="none" stroke="url(#lucky-light)" strokeWidth="4" strokeLinecap="round" opacity=".65" />
      <ellipse className="golden-lucky-cat__body" cx="131" cy="190" rx="61" ry="68" fill="url(#lucky-fur)" />
      <path className="golden-lucky-cat__belly" d="M104 155c11 12 35 15 51 1l13 91H91Z" fill="url(#lucky-light)" opacity=".72" />
      <g className="golden-lucky-cat__head">
        <path d="M76 103 72 42l43 30c10-4 21-4 31 0l41-30-4 61c8 15 7 35-1 50-11 21-30 31-52 31s-42-10-53-31c-8-16-9-35-1-50Z" fill="url(#lucky-fur)" />
        <path d="m79 53 28 20-24 15Z" fill="url(#lucky-ear)" /><path d="m181 53-25 20 23 15Z" fill="url(#lucky-ear)" />
        <path d="M93 111c6 6 14 8 22 7l15 19 14-19c9 1 17-2 23-8 5 20-6 50-37 50s-43-30-37-49Z" fill="url(#lucky-light)" />
        <g className="golden-lucky-cat__eyes"><ellipse cx="108" cy="105" rx="10" ry="13" fill="#d8d279" /><ellipse cx="153" cy="105" rx="10" ry="13" fill="#d8d279" /><ellipse cx="109" cy="107" rx="3.5" ry="8" fill="#18251d" /><ellipse cx="152" cy="107" rx="3.5" ry="8" fill="#18251d" /><circle cx="105" cy="100" r="2.4" fill="white" /><circle cx="148" cy="100" r="2.4" fill="white" /></g>
        <path d="m125 130 6-4 6 4-6 7Z" fill="#d98286" /><path d="M131 137c-1 8-12 9-16 3m16-3c1 8 12 9 16 3" fill="none" stroke="#62453b" strokeWidth="2.5" strokeLinecap="round" />
        <g fill="none" stroke="#eee9d7" strokeWidth="1.8" strokeLinecap="round" opacity=".9"><path d="M116 136 75 127M116 143l-45 5M146 136l41-9M146 143l45 5" /></g>
      </g>
      <path d="M94 166c22 12 50 12 73-1" fill="none" stroke="#a52f31" strokeWidth="8" strokeLinecap="round" />
      <g className="golden-lucky-cat__feet"><path d="M89 207c-3 23-2 39 5 45 7 6 27 4 31-4 3-6 1-24-3-43Z" fill="url(#lucky-light)" /><path d="M143 208c-3 22-2 38 5 44 7 5 26 3 30-5 3-6-1-25-4-43Z" fill="url(#lucky-light)" /></g>
      <g className="golden-lucky-cat__arm"><path className="golden-lucky-cat__upper-arm" d="M171 218c2-28 7-57 17-79 5-11 18-12 24-3 4 6 3 13 1 20-8 23-12 45-14 67Z" fill="url(#lucky-light)" /><g className="golden-lucky-cat__paw"><path d="M181 143c-5-11-5-23-2-36l5-22c3-11 13-17 23-13 10 4 14 14 10 24l-9 37c-3 12-18 18-27 10Z" fill="url(#lucky-light)" /><path d="M189 94c5 4 11 4 17 1m-19 11c6 4 13 4 20 0m-21 12c5 3 11 4 17 1" fill="none" stroke="#a66b32" strokeWidth="1.7" strokeLinecap="round" opacity=".62" /></g></g>
    </g>
    <path className="golden-lucky-cat__cushion" d="M49 255c20-19 143-19 163 0l-12 17H61Z" fill="#a73532" stroke="#762b29" strokeWidth="3" />
  </svg>
}
