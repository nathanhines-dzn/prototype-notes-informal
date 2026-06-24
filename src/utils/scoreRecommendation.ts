import type { ClassIndicator, NumericScore, RangeValue } from '../types'

const RANGE_WEIGHTS: Record<RangeValue, number> = {
  low: 1,
  mid: 2,
  high: 3,
}

const FORMAL_SCORES_BY_SUM: Record<number, NumericScore[]> = {
  4: [1, 2],
  5: [1, 2],
  6: [2, 3],
  7: [3, 4],
  8: [3, 4, 5],
  9: [4, 5],
  10: [5, 6],
  11: [6, 7],
  12: [6, 7],
}

export function areAllIndicatorsComplete(
  indicators: ClassIndicator[],
  indicatorValues: Record<string, RangeValue | null>,
): boolean {
  return indicators.every((indicator) => indicatorValues[indicator.id] != null)
}

export function getIndicatorSum(
  indicators: ClassIndicator[],
  indicatorValues: Record<string, RangeValue | null>,
): number | null {
  if (!areAllIndicatorsComplete(indicators, indicatorValues)) {
    return null
  }

  return indicators.reduce((sum, indicator) => {
    const value = indicatorValues[indicator.id]
    return sum + RANGE_WEIGHTS[value!]
  }, 0)
}

export function getFormalRecommendedScores(sum: number): NumericScore[] {
  return FORMAL_SCORES_BY_SUM[sum] ?? []
}

export function getInformalRecommendedRange(sum: number): RangeValue {
  const scores = getFormalRecommendedScores(sum)
  const center = (Math.min(...scores) + Math.max(...scores)) / 2

  if (center <= 2.5) return 'low'
  if (center <= 4.5) return 'mid'
  return 'high'
}

export type DimensionRecommendation =
  | { active: false }
  | { active: true; formalScores: NumericScore[] }
  | { active: true; informalRange: RangeValue }

export function getDimensionRecommendation(
  indicators: ClassIndicator[],
  indicatorValues: Record<string, RangeValue | null>,
  scoringType: 'range' | 'numeric',
): DimensionRecommendation {
  const sum = getIndicatorSum(indicators, indicatorValues)
  if (sum == null) {
    return { active: false }
  }

  if (scoringType === 'numeric') {
    return { active: true, formalScores: getFormalRecommendedScores(sum) }
  }

  return { active: true, informalRange: getInformalRecommendedRange(sum) }
}
