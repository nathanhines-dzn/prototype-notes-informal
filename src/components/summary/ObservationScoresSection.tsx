import { useState } from 'react'
import {
  getRollupForScoringType,
  getTableForScoringType,
} from '../../data/summaryMockData'
import type { ClassDimension, FlowDefinition } from '../../types'
import expandIcon from '../../assets/icon-summary-expand.svg'
import { ScoresDetailTable } from './ScoresDetailTable'
import { ScoresRollupSummary } from './ScoresRollupSummary'

type ObservationScoresSectionProps = {
  flow: FlowDefinition
  tableDimensions: ClassDimension[]
}

export function ObservationScoresSection({
  flow,
  tableDimensions,
}: ObservationScoresSectionProps) {
  const [expanded, setExpanded] = useState(false)
  const scoringType = flow.scoring.type
  const sectionTitle =
    scoringType === 'numeric' ? 'Observation Scores' : 'Observation Ranges'
  const reviewLabel =
    scoringType === 'numeric' ? 'Review and edit scores' : 'Review and edit ranges'

  const rollup = getRollupForScoringType(scoringType)
  const allTableRows = getTableForScoringType(scoringType)
  const activeIds = new Set(tableDimensions.map((dimension) => dimension.id))
  const tableRows = allTableRows.filter((row) => activeIds.has(row.dimensionId))

  return (
    <section className="rounded-lg bg-white shadow-sm">
      <div className="border-b border-gray-100 px-8 py-6">
        <h2 className="text-2xl font-semibold text-teachstone-navy">{sectionTitle}</h2>
      </div>

      <div className="px-8 py-6">
        <div className="rounded-xl p-3 shadow-[1px_1px_11px_0px_#d7e6ed]">
          <ScoresRollupSummary domains={rollup} />

          {!expanded && (
            <div className="pt-6">
              <button
                type="button"
                onClick={() => setExpanded(true)}
                className="flex w-full items-center rounded-xl p-3 text-left shadow-[1px_1px_11px_0px_#d7e6ed] transition-colors hover:bg-gray-50"
              >
                <img src={expandIcon} alt="" className="h-5 w-5 shrink-0" />
                <span className="w-full pl-3 text-base text-teachstone-navy">{reviewLabel}</span>
              </button>
            </div>
          )}

          {expanded && (
            <div className="pt-6">
              <div className="rounded-xl p-3 shadow-[1px_1px_11px_0px_#d7e6ed]">
                <div className="mb-8 flex flex-wrap items-center justify-between gap-3 pt-3">
                  <button
                    type="button"
                    onClick={() => setExpanded(false)}
                    className="flex items-center gap-3 text-base text-teachstone-navy hover:underline"
                  >
                    <img src={expandIcon} alt="" className="h-5 w-5 shrink-0 rotate-45" />
                    <span className="w-full">See less details</span>
                  </button>
                  <span className="text-base text-teachstone-navy">
                    (Select the cycle you want to edit)
                  </span>
                </div>
                <ScoresDetailTable rows={tableRows} />
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  )
}
