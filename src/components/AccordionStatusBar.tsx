import { Check } from './layout/icons'
import type {
  ClassIndicator,
  FlowDefinition,
  RangeValue,
  ScoreValue,
} from '../types'

const RANGE_LABELS: Record<RangeValue, string> = {
  low: 'Low',
  mid: 'Mid',
  high: 'High',
}

type AccordionStatusBarProps = {
  flow: FlowDefinition
  indicators: ClassIndicator[]
  indicatorValues: Record<string, RangeValue | null>
  overallValue: ScoreValue | null
}

function EmptyCircle({ ariaLabel }: { ariaLabel: string }) {
  return (
    <span
      aria-label={ariaLabel}
      className="inline-flex size-7 shrink-0 items-center justify-center rounded-full bg-white shadow-[1px_4px_10px_rgba(0,0,0,0.25)]"
    />
  )
}

function CompletedIndicatorCircle({ ariaLabel }: { ariaLabel: string }) {
  return (
    <span
      aria-label={ariaLabel}
      className="inline-flex size-7 shrink-0 items-center justify-center rounded-full bg-teachstone-complete shadow-[1px_4px_10px_rgba(0,0,0,0.25)]"
    >
      <Check className="size-[19px] text-white" aria-label="Complete" />
    </span>
  )
}

function OverallStatusCircle({
  flow,
  overallValue,
}: {
  flow: FlowDefinition
  overallValue: ScoreValue | null
}) {
  if (overallValue == null) {
    const label =
      flow.scoring.type === 'range' ? 'Overall range not selected' : 'Overall score not selected'
    return <EmptyCircle ariaLabel={label} />
  }

  if (flow.scoring.type === 'range') {
    const rangeValue = overallValue as RangeValue
    return (
      <span
        aria-label={`Overall range: ${RANGE_LABELS[rangeValue]}`}
        className="inline-flex h-7 min-w-7 shrink-0 items-center justify-center rounded-2xl bg-teachstone-complete px-3 text-base text-white shadow-[1px_4px_10px_rgba(0,0,0,0.25)]"
      >
        {RANGE_LABELS[rangeValue]}
      </span>
    )
  }

  return (
    <span
      aria-label={`Overall score: ${overallValue}`}
      className="inline-flex size-7 shrink-0 items-center justify-center rounded-full bg-teachstone-complete text-base text-white shadow-[1px_4px_10px_rgba(0,0,0,0.25)]"
    >
      {overallValue}
    </span>
  )
}

export function AccordionStatusBar({
  flow,
  indicators,
  indicatorValues,
  overallValue,
}: AccordionStatusBarProps) {
  const showIndicatorScoring = flow.features?.showIndicatorScoring !== false
  const allIndicatorsComplete = indicators.every(
    (indicator) => indicatorValues[indicator.id] != null,
  )

  return (
    <div className="flex items-center gap-12 rounded-xl bg-white px-4 py-2">
      {showIndicatorScoring && (
        <div className="flex items-center">
          <span className="text-base text-teachstone-slate">Indicators</span>
          <span className="pl-3">
            {allIndicatorsComplete ? (
              <CompletedIndicatorCircle ariaLabel="Indicators complete" />
            ) : (
              <EmptyCircle ariaLabel="Indicators not complete" />
            )}
          </span>
        </div>
      )}

      <div className="flex items-center">
        <span className="text-base text-teachstone-slate">{flow.scoring.overallToggleLabel}</span>
        <span className="pl-3">
          <OverallStatusCircle flow={flow} overallValue={overallValue} />
        </span>
      </div>
    </div>
  )
}
