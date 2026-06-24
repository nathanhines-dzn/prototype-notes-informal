import { useRef } from 'react'
import { DimensionAccordion } from '../components/DimensionAccordion'
import { FlowNav } from '../components/FlowNav'
import { CLASS_DIMENSIONS } from '../data/classDimensions'
import { getCurrentCycleNumber, usePrototype } from '../context/PrototypeContext'

export function CyclePage() {
  const {
    activeFlow,
    currentStep,
    cycleData,
    expandedDimensionId,
    setExpandedDimensionId,
    updateDimensionData,
  } = usePrototype()
  const contentRef = useRef<HTMLDivElement>(null)

  const cycleNumber = getCurrentCycleNumber(currentStep)
  if (!cycleNumber) return null

  const currentCycleData = cycleData[cycleNumber]

  const scrollToTop = () => {
    contentRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  return (
    <div ref={contentRef} className="px-20 pt-4 pb-[42px]">
      <section className="mb-4 rounded-lg bg-white px-8 py-6 shadow-sm">
        <div className="flex items-center gap-5">
          <span className="text-2xl text-teachstone-teal">+</span>
          <div>
            <h2 className="text-2xl text-teachstone-navy">Cycle Details</h2>
            <p className="text-sm text-teachstone-muted">Enter cycle information</p>
          </div>
        </div>
      </section>

      <section className="rounded-lg bg-white shadow-sm">
        <div className="border-b border-gray-100 px-8 py-6">
          <div className="flex items-center gap-5">
            <span className="text-2xl text-teachstone-teal">−</span>
            <div>
              <h2 className="text-2xl text-teachstone-navy">{activeFlow.scoring.sectionLabel}</h2>
              <p className="text-sm text-teachstone-muted">
                Select indicator and dimension {activeFlow.scoring.type === 'range' ? 'ranges' : 'scores'}
              </p>
            </div>
          </div>
        </div>

        <div className="space-y-4 px-14 py-6">
          {CLASS_DIMENSIONS.map((dimension) => (
            <DimensionAccordion
              key={dimension.id}
              dimension={dimension}
              data={currentCycleData[dimension.id]}
              flow={activeFlow}
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

        <FlowNav showBack={cycleNumber > 1 || activeFlow.steps[0]?.type === 'create'} />
      </section>
    </div>
  )
}
