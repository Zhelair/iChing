import { ArrowLeft, Pause, Play } from 'lucide-react'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { KimiGoldenLuckyCat } from '../components/KimiGoldenLuckyCat'

export function KimiGoldenPawLabPage() {
  const navigate = useNavigate()
  const [paused, setPaused] = useState(false)
  return <main className="golden-paw-practice">
    <button type="button" className="golden-paw-practice__exit" onClick={() => navigate(-1)}><ArrowLeft size={18} aria-hidden="true" />Back</button>
    <section aria-labelledby="kimi-lab-title"><header><p className="eyebrow">KIMI LAB · NOT LIVE</p><h1 id="kimi-lab-title">Golden Paw concept</h1><p>Kimi’s CSS-only 2.5D maneki-neko proposal, isolated for visual review.</p></header><div className="golden-paw-practice__stage"><span className="golden-paw-practice__orbit" aria-hidden="true" /><KimiGoldenLuckyCat motion phase={paused ? 'paused' : 'running'} /></div><div className="golden-paw-practice__controls"><button type="button" className="button button--secondary" onClick={() => setPaused(value => !value)}>{paused ? <Play size={17} /> : <Pause size={17} />}{paused ? 'Play' : 'Pause'}</button></div></section>
  </main>
}
