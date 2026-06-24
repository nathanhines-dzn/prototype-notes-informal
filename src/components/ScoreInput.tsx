import type { NumericScore } from '../types'

const SCORES: NumericScore[] = [1, 2, 3, 4, 5, 6, 7]

type ScoreInputProps = {
  value: NumericScore | null
  onChange: (value: NumericScore | null) => void
  highlightedValues?: NumericScore[]
}

export function ScoreInput({ value, onChange, highlightedValues }: ScoreInputProps) {
  return (
    <div className="flex items-center gap-4">
      {SCORES.map((score) => {
        const selected = value === score
        const highlighted = !selected && highlightedValues?.includes(score)
        return (
          <button
            key={score}
            type="button"
            onClick={() => onChange(selected ? null : score)}
            className={`flex h-7 min-w-7 items-center justify-center rounded-2xl px-1 text-base shadow-[1px_4px_10px_rgba(0,0,0,0.25)] transition-colors ${
              selected
                ? 'bg-teachstone-complete text-white'
                : highlighted
                  ? 'bg-teachstone-score-mid text-teachstone-navy shadow-[1px_4px_10px_rgba(0,0,0,0.25),inset_0_0_0_3px_var(--color-teachstone-score-mid-border)]'
                  : 'bg-white text-teachstone-navy hover:bg-gray-50'
            }`}
          >
            {score}
          </button>
        )
      })}
    </div>
  )
}
