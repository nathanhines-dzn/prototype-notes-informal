import { useRef, useState } from 'react'
import { FlowNav } from '../components/FlowNav'
import { DimensionNotesAccordion } from '../components/summary/DimensionNotesAccordion'
import { EnvironmentScoresSection } from '../components/summary/EnvironmentScoresSection'
import { ObservationFeedbackSection } from '../components/summary/ObservationFeedbackSection'
import { ObservationScoresSection } from '../components/summary/ObservationScoresSection'
import { DIMENSION_NOTES } from '../data/summaryMockData'
import { usePrototype } from '../context/PrototypeContext'

export function SummaryPage() {
  const { activeFlow, goToComplete, getActiveDimensions } = usePrototype()
  const contentRef = useRef<HTMLDivElement>(null)
  const [expandedNoteIds, setExpandedNoteIds] = useState<Set<string>>(new Set())

  const tableDimensions = getActiveDimensions()
  const notesByDimensionId = new Map(
    DIMENSION_NOTES.map((entry) => [entry.dimensionId, entry.notes]),
  )

  const toggleNoteAccordion = (dimensionId: string) => {
    setExpandedNoteIds((current) => {
      const next = new Set(current)
      if (next.has(dimensionId)) {
        next.delete(dimensionId)
      } else {
        next.add(dimensionId)
      }
      return next
    })
  }

  const scrollToTop = () => {
    contentRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  return (
    <div ref={contentRef} className="space-y-6 px-[42px] pt-4 pb-[42px]">
      <EnvironmentScoresSection />

      <ObservationScoresSection flow={activeFlow} tableDimensions={tableDimensions} />

      <section className="rounded-lg bg-white shadow-sm">
        <div className="border-b border-gray-100 px-8 py-6">
          <h2 className="text-2xl font-semibold text-teachstone-navy">Observation Notes</h2>
        </div>
        <div className="space-y-4 px-8 py-6">
          {tableDimensions.map((dimension) => {
            const notes = notesByDimensionId.get(dimension.id) ?? []
            return (
              <DimensionNotesAccordion
                key={dimension.id}
                dimensionName={dimension.name}
                notes={notes}
                expanded={expandedNoteIds.has(dimension.id)}
                onToggle={() => toggleNoteAccordion(dimension.id)}
              />
            )
          })}
        </div>
      </section>

      <ObservationFeedbackSection />

      <div className="flex justify-center pb-2">
        <button
          type="button"
          onClick={scrollToTop}
          className="inline-flex items-center gap-2 py-2 text-base text-teachstone-teal hover:underline"
        >
          Back to top ↑
        </button>
      </div>

      <section className="rounded-lg bg-white shadow-sm">
        <FlowNav nextLabel="Complete" onNext={goToComplete} />
      </section>
    </div>
  )
}
