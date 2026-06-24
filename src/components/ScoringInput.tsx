import { RangeInput } from './RangeInput'
import { ScoreInput } from './ScoreInput'
import type { NumericScore, RangeValue, ScoreValue } from '../types'

type ScoringInputProps = {
  scoringType: 'range' | 'numeric'
  value: ScoreValue | null
  onChange: (value: ScoreValue | null) => void
  highlightedScores?: NumericScore[]
  highlightedRanges?: RangeValue[]
}

export function ScoringInput({
  scoringType,
  value,
  onChange,
  highlightedScores,
  highlightedRanges,
}: ScoringInputProps) {
  if (scoringType === 'range') {
    return (
      <RangeInput
        value={value as RangeValue | null}
        onChange={onChange}
        highlightedValues={highlightedRanges}
      />
    )
  }

  return (
    <ScoreInput
      value={value as NumericScore | null}
      onChange={onChange}
      highlightedValues={highlightedScores}
    />
  )
}
