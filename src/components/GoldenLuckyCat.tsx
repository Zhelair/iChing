import { KimiGoldenLuckyCat } from './KimiGoldenLuckyCat'

type Props = { motion: boolean; phase: 'ready' | 'running' | 'paused' | 'complete' }

// Kimi's CSS-built Maneki-neko is now the production companion.
export function GoldenLuckyCat(props: Props) {
  return <KimiGoldenLuckyCat {...props} />
}
