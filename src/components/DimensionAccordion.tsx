import { useState } from 'react'
import { AccordionStatusBar } from './AccordionStatusBar'
import { DimensionNotesList } from './notes/DimensionNotesList'
import { RangeInput } from './RangeInput'
import { ScoringInput } from './ScoringInput'
import type {
  ClassDimension,
  CycleNote,
  DimensionCycleData,
  FlowDefinition,
  RangeValue,
  ScoreValue,
} from '../types'
import {
  areAllIndicatorsComplete,
  getDimensionRecommendation,
} from '../utils/scoreRecommendation'

const DEFAULT_INDICATOR_LEVELS: RangeValue[] = ['low', 'mid', 'high']
const INCOMPLETE_INDICATORS_ERROR = 'Complete indicator range selections.'

function getIndicatorValue(
  indicatorLevels: RangeValue[] | undefined,
  storedValue: RangeValue | null | undefined,
): RangeValue | null {
  const allowedLevels = indicatorLevels ?? DEFAULT_INDICATOR_LEVELS
  if (storedValue != null && allowedLevels.includes(storedValue)) {
    return storedValue
  }
  return null
}

type DimensionAccordionProps = {
  dimension: ClassDimension
  data: DimensionCycleData
  flow: FlowDefinition
  dimensionNotes?: CycleNote[]
  expanded: boolean
  onToggleExpand: () => void
  onChange: (next: DimensionCycleData) => void
}

export function DimensionAccordion({
  dimension,
  data,
  flow,
  dimensionNotes,
  expanded,
  onToggleExpand,
  onChange,
}: DimensionAccordionProps) {
  const [showIncompleteIndicatorsError, setShowIncompleteIndicatorsError] = useState(false)
  const showStructuredNotes = flow.features?.structuredNotes === true
  const showIndicatorScoring = flow.features?.showIndicatorScoring !== false
  const recommendation = getDimensionRecommendation(
    dimension.indicators,
    data.indicatorValues,
    flow.scoring.type,
  )
  const showRecommendationHighlights = recommendation.active && data.overallValue == null

  const handleIndicatorChange = (indicatorId: string, value: RangeValue | null) => {
    const nextIndicatorValues = {
      ...data.indicatorValues,
      [indicatorId]: value,
    }
    const indicatorsComplete = areAllIndicatorsComplete(
      dimension.indicators,
      nextIndicatorValues,
    )

    if (indicatorsComplete) {
      setShowIncompleteIndicatorsError(false)
    }

    onChange({
      ...data,
      indicatorValues: nextIndicatorValues,
      overallValue:
        !indicatorsComplete && data.overallValue != null ? null : data.overallValue,
    })
  }

  const handleOverallChange = (value: ScoreValue | null) => {
    if (
      showIndicatorScoring &&
      !areAllIndicatorsComplete(dimension.indicators, data.indicatorValues)
    ) {
      setShowIncompleteIndicatorsError(true)
      return
    }

    setShowIncompleteIndicatorsError(false)
    onChange({ ...data, overallValue: value })
  }

  return (
    <div
      className="overflow-hidden rounded-[9px] border-l-[10px] border-teachstone-teal bg-teachstone-card pb-0"
    >
      <div
        role="button"
        tabIndex={0}
        aria-expanded={expanded}
        onClick={onToggleExpand}
        onKeyDown={(event) => {
          if (event.key === 'Enter' || event.key === ' ') {
            event.preventDefault()
            onToggleExpand()
          }
        }}
        className="flex cursor-pointer items-center justify-between px-7 py-3"
      >
        <span className="text-base font-bold text-teachstone-navy">
          {dimension.name} ({dimension.abbr})
        </span>

        <AccordionStatusBar
          flow={flow}
          indicators={dimension.indicators}
          indicatorValues={data.indicatorValues}
          overallValue={data.overallValue}
        />
      </div>

      {expanded && (
        <div className="mx-7 border-t-[3px] border-white">
          {showStructuredNotes ? (
            <DimensionNotesList notes={dimensionNotes ?? []} />
          ) : (
            <div className="flex w-full flex-col gap-6 pt-6">
              <div className="space-y-2">
                <label
                  htmlFor={`notes-${dimension.id}`}
                  className="block text-base text-teachstone-navy"
                >
                  Observation Notes
                </label>
                <textarea
                  id={`notes-${dimension.id}`}
                  value={data.notes}
                  onChange={(event) => onChange({ ...data, notes: event.target.value })}
                  placeholder="Enter dimension specific observation notes."
                  className="min-h-24 w-full resize-y rounded-[11px] border-0 bg-white px-8 py-6 text-base text-gray-400 outline-none focus:text-teachstone-navy"
                />
              </div>
              <div className="h-[3px] w-full border-t-[3px] border-white" />
            </div>
          )}

          <div className="pt-6 pb-6">
              {showIndicatorScoring && (
                <div className="space-y-2">
                  {dimension.indicators.map((indicator) => (
                    <div
                      key={indicator.id}
                      className="flex items-center justify-between gap-6 pr-[100px]"
                    >
                      <span className="text-base text-teachstone-navy">{indicator.name}</span>
                      <RangeInput
                        value={getIndicatorValue(
                          indicator.levels,
                          data.indicatorValues[indicator.id],
                        )}
                        options={indicator.levels}
                        onChange={(value) => handleIndicatorChange(indicator.id, value)}
                      />
                    </div>
                  ))}
                </div>
              )}

              {showIndicatorScoring && showIncompleteIndicatorsError && (
                <div className="mt-2 flex justify-end pr-[100px]">
                  <p
                    role="alert"
                    className="w-[270px] text-base text-teachstone-error"
                  >
                    {INCOMPLETE_INDICATORS_ERROR}
                  </p>
                </div>
              )}

              <div
                className={`flex items-center justify-between gap-6 pr-[100px] ${
                  showIndicatorScoring ? 'mt-12' : ''
                }`}
              >
                <span className="text-base text-teachstone-navy">
                  {flow.scoring.overallLabel}
                </span>
                <ScoringInput
                  scoringType={flow.scoring.type}
                  value={data.overallValue}
                  onChange={handleOverallChange}
                  highlightedScores={
                    showRecommendationHighlights && 'formalScores' in recommendation
                      ? recommendation.formalScores
                      : undefined
                  }
                  highlightedRanges={
                    showRecommendationHighlights && 'informalRange' in recommendation
                      ? [recommendation.informalRange]
                      : undefined
                  }
                />
              </div>
          </div>
        </div>
      )}
    </div>
  )
}
