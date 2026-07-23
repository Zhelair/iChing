import { useId } from 'react'
import type { CompanionPet as CompanionPetKind } from '../domain/types'

export type CompanionAnimation = 'idle' | 'sleep' | 'cat-purr' | 'cat-treat' | 'cat-paw' | 'cat-stretch' | 'dog-greet' | 'dog-fetch' | 'dog-belly' | 'dog-wiggle'

type Props = {
  pet: CompanionPetKind
  animation?: CompanionAnimation
  motion?: boolean
  className?: string
  title?: string
  variant?: 'default' | 'golden-lucky'
}

export function CompanionPet({ pet, animation = 'idle', motion = true, className = '', title, variant = 'default' }: Props) {
  const rawId = useId().replaceAll(':', '')
  const label = title ?? (pet === 'cat' ? 'Tuxedo cat companion' : 'Labrador companion')

  return (
    <svg
      className={`companion-pet companion-pet--${pet} companion-pet--${animation} companion-pet--${variant} ${motion ? 'has-motion' : 'is-still'} ${className}`}
      viewBox="0 0 240 240"
      role="img"
      aria-label={label}
    >
      <defs>
        <radialGradient id={`${rawId}-glow`} cx="50%" cy="50%" r="50%">
          <stop offset="0" stopColor="var(--jade-light)" stopOpacity=".92" />
          <stop offset="1" stopColor="var(--jade-light)" stopOpacity="0" />
        </radialGradient>
        <linearGradient id={`${rawId}-black-fur`} x1="25%" y1="8%" x2="75%" y2="92%">
          <stop offset="0" stopColor="#4a5150" />
          <stop offset=".38" stopColor="#202927" />
          <stop offset="1" stopColor="#0d1413" />
        </linearGradient>
        <linearGradient id={`${rawId}-white-fur`} x1="15%" y1="5%" x2="78%" y2="95%">
          <stop offset="0" stopColor="#fffef7" />
          <stop offset=".58" stopColor="#e8e7dc" />
          <stop offset="1" stopColor="#c9c9bd" />
        </linearGradient>
        <linearGradient id={`${rawId}-gold-fur`} x1="20%" y1="6%" x2="80%" y2="96%">
          <stop offset="0" stopColor="#e8bc70" />
          <stop offset=".42" stopColor="#c88b3f" />
          <stop offset="1" stopColor="#8a5327" />
        </linearGradient>
        <linearGradient id={`${rawId}-gold-light`} x1="12%" y1="0" x2="85%" y2="100%">
          <stop offset="0" stopColor="#ffe2a6" />
          <stop offset="1" stopColor="#bd7432" />
        </linearGradient>
        <filter id={`${rawId}-shadow`} x="-35%" y="-35%" width="170%" height="190%">
          <feDropShadow dx="0" dy="8" stdDeviation="7" floodColor="#0d231b" floodOpacity=".23" />
        </filter>
        <filter id={`${rawId}-soft`} x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="4" />
        </filter>
      </defs>

      <ellipse className="companion-pet__glow" cx="120" cy="175" rx="92" ry="55" fill={`url(#${rawId}-glow)`} />
      <ellipse className="companion-pet__ground" cx="120" cy="211" rx="70" ry="12" fill="#10251d" opacity=".16" filter={`url(#${rawId}-soft)`} />
      {pet === 'cat'
        ? <TuxedoCat idBase={rawId} golden={variant === 'golden-lucky'} />
        : <Labrador idBase={rawId} />}
    </svg>
  )
}

function TuxedoCat({ idBase, golden }: { idBase: string; golden: boolean }) {
  const darkFur = golden ? `${idBase}-gold-fur` : `${idBase}-black-fur`
  const lightFur = golden ? `${idBase}-gold-light` : `${idBase}-white-fur`
  return <g className="companion-pet__character companion-cat" filter={`url(#${idBase}-shadow)`}>
    <path className="companion-cat__lucky-cushion" d="M48 211c16-15 128-15 145 0l-9 14H57Z" fill="#a9352f" stroke="#7a2524" strokeWidth="3" />
    <path className="companion-cat__tail" d="M70 180c-37 8-45-26-27-43 10-9 25-8 32 2-16-3-25 8-21 18 4 12 18 12 30 7" fill="none" stroke={`url(#${darkFur})`} strokeWidth="16" strokeLinecap="round" />
    <ellipse className="companion-cat__body" cx="121" cy="158" rx="54" ry="60" fill={`url(#${darkFur})`} />
    <path d="M94 119c8 8 15 12 27 13 13-1 23-7 30-14l8 70H82z" fill={`url(#${lightFur})`} opacity=".98" />
    <g className="companion-cat__head">
      <path d="M77 85 73 36l36 25c8-3 17-3 25 0l34-25-3 50c5 11 4 26-2 38-9 17-24 26-43 26s-35-9-44-26c-7-13-7-28 1-39Z" fill={`url(#${darkFur})`} />
      <path d="m80 48 22 17-20 11Z" fill={golden ? '#d9573e' : '#b67a73'} opacity=".72" />
      <path d="m160 48-20 17 19 11Z" fill={golden ? '#d9573e' : '#b67a73'} opacity=".72" />
      <path d="M92 91c4 4 10 6 16 5l12 16 12-16c7 1 13-1 17-5 5 16-4 42-29 42S87 107 92 91Z" fill={`url(#${lightFur})`} />
      <g className="companion-pet__eyes">
        <ellipse cx="101" cy="88" rx="9" ry="11" fill="#c9c777" /><ellipse cx="139" cy="88" rx="9" ry="11" fill="#c9c777" />
        <ellipse cx="102" cy="89" rx="3" ry="7" fill="#14221d" /><ellipse cx="138" cy="89" rx="3" ry="7" fill="#14221d" />
        <circle cx="99" cy="84" r="2" fill="white" /><circle cx="135" cy="84" r="2" fill="white" />
      </g>
      <path d="m115 108 5-3 5 3-5 6Z" fill="#d68d91" />
      <path d="M120 114c-1 7-10 8-13 3m13-3c1 7 10 8 13 3" fill="none" stroke="#5e4541" strokeWidth="2" strokeLinecap="round" />
      <g className="companion-cat__whiskers" fill="none" stroke="#d9d9cf" strokeWidth="1.5" strokeLinecap="round" opacity=".9">
        <path d="M106 112 71 105M106 118l-38 4M134 112l35-7M134 118l38 4" />
      </g>
    </g>
    <path className="companion-pet__collar" d="M90 132c19 9 42 9 61-1" fill="none" stroke={golden ? '#a9362e' : 'var(--brass)'} strokeWidth="6" strokeLinecap="round" />
    <circle cx="121" cy="139" r="7" fill="var(--jade)" stroke="#f5e5af" strokeWidth="2" />
    <g className="companion-cat__paws">
      <path d="M82 168c-3 22-4 40 1 46 5 7 23 5 28-2 3-5 1-22-2-38Z" fill={`url(#${lightFur})`} />
      <path className="companion-cat__paw-right" d="M132 173c-3 21-4 36 1 42 5 6 22 5 27-2 3-5 0-24-3-42Z" fill={`url(#${lightFur})`} />
      <path d="M86 208c6 3 14 3 21 0m29 1c6 3 14 3 20 0" fill="none" stroke="#aaa99f" strokeWidth="1.4" />
    </g>
    <g className="companion-cat__lucky-arm">
      <path className="companion-cat__lucky-upper-arm" d="M145 175c1-21 5-42 12-57 4-8 17-5 18 4 1 16-2 37-7 57Z" fill={`url(#${lightFur})`} />
      <g className="companion-cat__lucky-forepaw">
        <path d="M155 123c-2-15-1-33 2-48 2-10 15-12 20-3 5 8 1 21-1 28-1 8 0 17 1 25-5 7-16 7-22-2Z" fill={`url(#${lightFur})`} />
        <path d="M159 79c4 2 9 2 14-1m-16 10c5 2 11 2 17-1" fill="none" stroke="#a86c35" strokeWidth="1.4" strokeLinecap="round" opacity=".65" />
      </g>
    </g>
    <g className="companion-cat__treat">
      <path d="M168 166c8-8 21-2 20 8-1 11-16 14-25 7Z" fill="#ba7540" stroke="#74452c" strokeWidth="2" />
      <circle cx="174" cy="171" r="2" fill="#f3d08b" /><circle cx="182" cy="175" r="2" fill="#f3d08b" />
    </g>
    <path className="companion-cat__purr" d="M58 112c-14 0-14 17 0 17 14 0 14 17 0 17" fill="none" stroke="var(--brass)" strokeWidth="3" strokeLinecap="round" />
    <g className="companion-cat__lucky-charm">
      <ellipse cx="112" cy="176" rx="24" ry="30" fill="#d9a53c" stroke="#8e5c21" strokeWidth="3" />
      <path d="M100 171h24m-21 9h18m-13-18v29m9-29v29" fill="none" stroke="#fff0b4" strokeWidth="3" strokeLinecap="round" />
    </g>
  </g>
}

function Labrador({ idBase }: { idBase: string }) {
  return <g className="companion-pet__character companion-dog" filter={`url(#${idBase}-shadow)`}>
    <path className="companion-dog__tail" d="M168 154c28-14 32-36 17-45" fill="none" stroke={`url(#${idBase}-gold-fur)`} strokeWidth="18" strokeLinecap="round" />
    <ellipse className="companion-dog__body" cx="120" cy="163" rx="58" ry="53" fill={`url(#${idBase}-gold-fur)`} />
    <path d="M101 126c8 11 30 12 40 0l19 64H81Z" fill={`url(#${idBase}-gold-light)`} opacity=".77" />
    <g className="companion-dog__head">
      <path className="companion-dog__ear companion-dog__ear--left" d="M87 68C70 51 51 59 52 82c1 24 14 40 30 35 8-3 11-19 13-36Z" fill="#8f5729" />
      <path className="companion-dog__ear companion-dog__ear--right" d="M153 68c17-17 36-9 35 14-1 24-14 40-30 35-8-3-11-19-13-36Z" fill="#8f5729" />
      <ellipse cx="120" cy="88" rx="44" ry="49" fill={`url(#${idBase}-gold-fur)`} />
      <path d="M91 73c7-18 21-28 36-29-8 7-12 13-15 22-8-1-15 2-21 7Z" fill="#f4cf89" opacity=".48" />
      <path d="M111 62c4-6 14-6 19 0" fill="none" stroke="#a66b31" strokeWidth="3" strokeLinecap="round" opacity=".55" />
      <g className="companion-pet__eyes">
        <ellipse cx="103" cy="83" rx="6.5" ry="7.5" fill="#402b1f" /><ellipse cx="137" cy="83" rx="6.5" ry="7.5" fill="#402b1f" />
        <circle cx="101" cy="81" r="2" fill="white" /><circle cx="135" cy="81" r="2" fill="white" />
      </g>
      <path d="M94 103c5-13 16-19 26-19s22 6 27 19c5 13-4 29-27 29s-31-16-26-29Z" fill="#efc77f" />
      <path d="M108 101c4-7 20-7 24 0-1 8-7 11-12 11s-11-3-12-11Z" fill="#33251f" />
      <path className="companion-dog__smile" d="M120 112c0 10-10 13-18 7m18-7c0 10 10 13 18 7" fill="none" stroke="#62402d" strokeWidth="2.5" strokeLinecap="round" />
      <path className="companion-dog__tongue" d="M112 120h16v10c0 10-16 10-16 0Z" fill="#dc817a" stroke="#8f514f" strokeWidth="1.5" />
    </g>
    <path className="companion-pet__collar" d="M88 131c20 11 44 11 65 0" fill="none" stroke="var(--jade)" strokeWidth="7" strokeLinecap="round" />
    <path d="m120 136 8 6-8 10-8-10Z" fill="var(--brass)" stroke="#f8e7b0" strokeWidth="2" />
    <g className="companion-dog__paws">
      <path d="M75 170c-1 20 2 39 9 44 7 5 25 2 27-7l-5-36Z" fill={`url(#${idBase}-gold-light)`} />
      <path d="M134 171c-4 22-4 36 2 42 6 5 23 3 26-5 2-6-3-27-7-40Z" fill={`url(#${idBase}-gold-light)`} />
      <path d="M86 207c6 2 13 2 19-1m34 2c6 2 13 1 19-2" fill="none" stroke="#9d642f" strokeWidth="1.5" />
    </g>
    <g className="companion-dog__stick">
      <path d="M49 176 189 149" fill="none" stroke="#86562f" strokeWidth="8" strokeLinecap="round" />
      <path d="m57 175-10-9m132-15 9-12" fill="none" stroke="#86562f" strokeWidth="5" strokeLinecap="round" />
    </g>
    <path className="companion-dog__heart" d="M176 74c9-12 28 2 11 18l-11 10-11-10c-17-16 2-30 11-18Z" fill="var(--brass)" />
  </g>
}
