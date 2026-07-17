import type { CastLine, Polarity } from '../domain/types'

type FigureLine = { polarity: Polarity; moving?: boolean }

export function HexagramFigure({
  linesBottomUp,
  label,
  className = '',
}: {
  linesBottomUp: readonly (FigureLine | CastLine | Polarity)[]
  label: string
  className?: string
}) {
  const normalized = linesBottomUp.map((line) => typeof line === 'string' ? { polarity: line } : line)

  return (
    <div className={`hexagram-lines ${className}`} role="img" aria-label={label}>
      {[...normalized].reverse().map((line, reverseIndex) => {
        const position = normalized.length - reverseIndex
        return (
          <div className="hex-line" key={position}>
            {line.polarity === 'yang' ? <span className="hex-line__bar" /> : <><span className="hex-line__bar" /><span className="hex-line__bar" /></>}
            {'moving' in line && line.moving ? <span className="hex-line__moving" aria-hidden="true" /> : null}
          </div>
        )
      })}
    </div>
  )
}
