import { Check } from './icons'
import { getCurrentCycleNumber, usePrototype } from '../../context/PrototypeContext'

type SidebarItem = {
  id: string
  label: string
  status: 'completed' | 'active' | 'upcoming' | 'locked'
}

export function Sidebar() {
  const { activeFlow, currentStep, observationMeta } = usePrototype()
  const currentCycle = getCurrentCycleNumber(currentStep)
  const isComplete = currentStep.type === 'complete'

  const items: SidebarItem[] = [
    { id: 'details', label: 'Observation Details', status: 'completed' },
    { id: 'environment', label: 'Environment', status: 'completed' },
    ...Array.from({ length: observationMeta.numberOfCycles }, (_, index) => {
      const cycleNumber = index + 1
      let status: SidebarItem['status'] = 'upcoming'
      if (isComplete) status = 'completed'
      else if (currentCycle === cycleNumber) status = 'active'
      else if (currentCycle !== null && cycleNumber < currentCycle) status = 'completed'
      return {
        id: `cycle-${cycleNumber}`,
        label: `Cycle ${cycleNumber}`,
        status,
      }
    }),
    { id: 'evidence', label: 'Evidence', status: isComplete ? 'upcoming' : 'upcoming' },
    { id: 'summary', label: 'Summary', status: 'locked' },
  ]

  return (
    <aside className="w-64 shrink-0 border-r border-gray-200 bg-white">
      <div className="bg-teachstone-teal px-4 py-3 text-sm font-medium leading-snug text-[var(--tw-ring-offset-color)]">
        {activeFlow.sidebar.title}
      </div>

      <nav className="pointer-events-none select-none px-1" aria-disabled="true">
        {items.map((item) => (
          <div
            key={item.id}
            className={`mx-1 mb-1 flex items-center justify-between rounded px-3 py-2 text-base ${
              item.status === 'active'
                ? 'bg-gray-100 font-medium text-teachstone-navy'
                : item.status === 'locked'
                  ? 'text-gray-400'
                  : 'text-teachstone-slate'
            }`}
          >
            <span>{item.label}</span>
            {item.status === 'completed' && (
              <Check className="h-4 w-4 text-green-600" aria-label="Completed" />
            )}
          </div>
        ))}
      </nav>

      <div className="mt-6 border-t border-gray-200 px-4 pt-4">
        <button
          type="button"
          disabled
          className="mb-4 flex w-full items-center gap-3 rounded px-3 py-2 text-left text-base text-teachstone-slate opacity-60"
        >
          <span className="flex h-5 w-5 items-center justify-center rounded-full bg-teachstone-navy text-xs text-white">
            +
          </span>
          Add a cycle
        </button>
        <button
          type="button"
          disabled
          className="w-full rounded border border-gray-300 px-4 py-2 text-sm text-teachstone-slate opacity-60"
        >
          Exit Observation
        </button>
      </div>
    </aside>
  )
}
