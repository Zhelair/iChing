import './GoldenLuckyCat.css'

type Props = { motion: boolean; phase: 'ready' | 'running' | 'paused' | 'complete' }
const catSrc = '/golden-paw/maneki-neko-gold-v1.png'

export function GoldenLuckyCat({ motion, phase }: Props) {
  const isAnimating = motion && (phase === 'running' || phase === 'complete')

  return (
    <div
      className={`golden-lucky-cat ${isAnimating ? 'golden-lucky-cat--beckoning' : ''}`}
      role="img"
      aria-label="A golden Maneki-neko lucky cat with a raised beckoning paw"
    >
      <img className="golden-lucky-cat__base" src={catSrc} alt="" />
      <img className="golden-lucky-cat__arm" src={catSrc} alt="" aria-hidden="true" />
    </div>
  )
}
