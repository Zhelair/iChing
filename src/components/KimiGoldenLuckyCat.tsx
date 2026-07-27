import './KimiGoldenLuckyCat.css'

type Props = { motion: boolean; phase: 'ready' | 'running' | 'paused' | 'complete' }

// Isolated, as-delivered Kimi experiment. It deliberately does not replace the production SVG.
export function KimiGoldenLuckyCat({ motion, phase }: Props) {
  const isAnimating = motion && (phase === 'running' || phase === 'complete')
  const isPaused = phase === 'paused'
  return <div className={`kimi-golden-lucky-cat ${isAnimating ? 'is-animating' : ''} ${isPaused ? 'is-paused' : ''}`} role="img" aria-label="Kimi's golden waving lucky cat concept">
    <div className="kimi-glc-sparkles" aria-hidden="true"><span /><span /><span /><span /><span /></div>
    <div className="kimi-glc-cat">
      <div className="kimi-glc-tail" />
      <div className="kimi-glc-ear kimi-glc-ear--left" /><div className="kimi-glc-ear kimi-glc-ear--right" />
      <div className="kimi-glc-head"><div className="kimi-glc-eye kimi-glc-eye--left"><i /><b /></div><div className="kimi-glc-eye kimi-glc-eye--right"><i /><b /></div><div className="kimi-glc-nose" /><div className="kimi-glc-mouth"><i /></div><div className="kimi-glc-whiskers"><span /><span /><span /><span /><span /><span /></div></div>
      <div className="kimi-glc-collar" /><div className="kimi-glc-bell"><i /></div>
      <div className="kimi-glc-body"><div className="kimi-glc-bib" /></div>
      <div className="kimi-glc-paw-arm"><div className="kimi-glc-paw-hand"><div><span /><span /><span /></div></div></div>
      <div className="kimi-glc-coin-paw"><div className="kimi-glc-coin">福</div></div>
      <div className="kimi-glc-leg kimi-glc-leg--left" /><div className="kimi-glc-leg kimi-glc-leg--right" />
      <div className="kimi-glc-base"><i /></div>
    </div>
  </div>
}
