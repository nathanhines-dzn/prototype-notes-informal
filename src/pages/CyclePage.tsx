import { useEffect, useRef } from 'react'
import { CycleSectionAccordion } from '../components/CycleSectionAccordion'
import { DimensionAccordion } from '../components/DimensionAccordion'
import { FlowNav } from '../components/FlowNav'
import { NotesSection } from '../components/notes/NotesSection'
import { getCurrentCycleNumber, usePrototype } from '../context/PrototypeContext'
import type { CycleSectionId } from '../types'

export function CyclePage() {
  const {
    activeFlow,
    currentStep,
    cycleData,
    cycleNotes,
    expandedDimensionId,
    expandedCycleSection,
    setExpandedDimensionId,
    toggleCycleSection,
    updateDimensionData,
    addCycleNote,
    updateCycleNote,
    deleteCycleNote,
    syncDimensionNotes,
    getNotesForDimension,
    goToSummary,
    getActiveDimensions,
  } = usePrototype()
  const contentRef = useRef<HTMLDivElement>(null)

  const cycleNumber = getCurrentCycleNumber(currentStep)
  const activeDimensions = getActiveDimensions()
  const showStructuredNotes = activeFlow.features?.structuredNotes === true

  useEffect(() => {
    if (
      expandedDimensionId &&
      !activeDimensions.some((dimension) => dimension.id === expandedDimensionId)
    ) {
      setExpandedDimensionId(null)
    }
  }, [activeDimensions, expandedDimensionId, setExpandedDimensionId])

  if (!cycleNumber) return null

  const currentCycleData = cycleData[cycleNumber]
  const currentCycleNotes = cycleNotes[cycleNumber] ?? []

  const scrollToTop = () => {
    contentRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  const handleSectionToggle = (sectionId: CycleSectionId) => {
    toggleCycleSection(sectionId)
  }

  const scoringSubtitle =
    activeFlow.scoring.type === 'range'
      ? 'Select indicator and dimension ranges'
      : 'Select indicator and dimension scores'

  return (
    <div ref={contentRef} className="flex flex-col gap-4 px-[42px] pt-4 pb-[42px]">
      <CycleSectionAccordion
        title="Cycle Details"
        subtitle="Enter cycle information"
        expanded={expandedCycleSection === 'cycle-details'}
        onToggle={() => handleSectionToggle('cycle-details')}
        className="mb-0"
      >
        <p className="text-sm text-teachstone-muted">Enter cycle information</p>
      </CycleSectionAccordion>

      {showStructuredNotes && (
        <CycleSectionAccordion
          title="Notes"
          subtitle="Add notes for each dimension observed"
          expanded={expandedCycleSection === 'notes'}
          onToggle={() => handleSectionToggle('notes')}
          className="mb-0"
        >
          <NotesSection
            cycleNumber={cycleNumber}
            notes={currentCycleNotes}
            dimensions={activeDimensions}
            onAddNote={(text, dimensionId) => addCycleNote(cycleNumber, text, dimensionId)}
            onUpdateNote={(noteId, patch) => updateCycleNote(cycleNumber, noteId, patch)}
            onDeleteNote={(noteId) => deleteCycleNote(cycleNumber, noteId)}
            onSyncDimensionNotes={(dimensionId, parsedTexts) =>
              syncDimensionNotes(cycleNumber, dimensionId, parsedTexts)
            }
          />
        </CycleSectionAccordion>
      )}

      <CycleSectionAccordion
        title={activeFlow.scoring.sectionLabel}
        subtitle={scoringSubtitle}
        expanded={expandedCycleSection === 'enter-scoring'}
        onToggle={() => handleSectionToggle('enter-scoring')}
        className="mb-0"
        bodyClassName="p-0"
      >
        <div className="space-y-4 px-8 py-6">
          {activeDimensions.map((dimension) => (
            <DimensionAccordion
              key={dimension.id}
              dimension={dimension}
              data={currentCycleData[dimension.id]}
              flow={activeFlow}
              dimensionNotes={
                showStructuredNotes ? getNotesForDimension(cycleNumber, dimension.id) : undefined
              }
              expanded={expandedDimensionId === dimension.id}
              onToggleExpand={() =>
                setExpandedDimensionId(
                  expandedDimensionId === dimension.id ? null : dimension.id,
                )
              }
              onChange={(next) => updateDimensionData(cycleNumber, dimension.id, () => next)}
            />
          ))}
        </div>

        <div className="flex justify-center pb-2">
          <button
            type="button"
            onClick={scrollToTop}
            className="inline-flex items-center gap-2 py-2 text-base text-teachstone-teal hover:underline"
          >
            Back to top ↑
          </button>
        </div>

        <FlowNav showBack={activeFlow.steps[0]?.type === 'create'} onNext={goToSummary} />
      </CycleSectionAccordion>
    </div>
  )
}
