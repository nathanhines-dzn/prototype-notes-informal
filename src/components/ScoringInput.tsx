import { RangeInput } from './RangeInput'
import { ScoreInput } from './ScoreInput'
import type { NumericScore, RangeValue, ScoreValue } from '../types'

type ScoringInputProps = {
  scoringType: 'range' | 'numeric'
  value: ScoreValue | null
  onChange: (value: ScoreValue | null) => void
}

export function ScoringInput({ scoringType, value, onChange }: ScoringInputProps) {
  if (scoringType === 'range') {
    return (
      <RangeInput
        value={value as RangeValue | null}
        onChange={onChange}
      />
    )
  }

  return (
    <ScoreInput
      value={value as NumericScore | null}
      onChange={onChange}
    />
  )
}
