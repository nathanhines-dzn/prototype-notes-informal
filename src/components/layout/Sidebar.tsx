import { getCurrentCycleNumber, usePrototype } from '../../context/PrototypeContext'
import { Check } from './icons'

const SIDEBAR_NOTICE_ID = 'sidebar-prototype-notice'
const PREVIEW_TOOLTIP = 'Preview only — use Next to continue.'

type SidebarItem = {
  id: string
  label: string
  status: 'completed' | 'active' | 'upcoming' | 'locked'
}

function SidebarNavItem({ item }: { item: SidebarItem }) {
  const isActive = item.status === 'active'

  return (
    <div className="group relative mx-1 mb-1">
      <div
        aria-current={isActive ? 'step' : undefined}
        className={`flex items-center justify-between rounded px-3 py-2 text-sm ${
          item.status === 'active'
            ? 'bg-gray-100 font-bold text-teachstone-navy'
            : item.status === 'locked'
              ? 'text-gray-400'
              : 'font-bold text-teachstone-slate'
        }`}
      >
        <span>{item.label}</span>
        {item.status === 'completed' && (
          <span
            aria-label="Completed"
            className="inline-flex size-4 shrink-0 items-center justify-center rounded-full bg-teachstone-complete"
          >
            <Check className="size-2.5 text-white" />
          </span>
        )}
      </div>

      {!isActive && (
        <span
          role="tooltip"
          className="pointer-events-none absolute left-0 top-full z-20 mt-1 w-max max-w-[220px] rounded-md bg-[#1A0238] px-3 py-1.5 text-xs font-medium leading-snug text-white opacity-0 shadow-lg transition-opacity duration-150 group-hover:opacity-100 group-focus-within:opacity-100"
        >
          {PREVIEW_TOOLTIP}
        </span>
      )}
    </div>
  )
}

export function Sidebar() {
  const { activeFlow, currentStep, observationMeta } = usePrototype()
  const currentCycle = getCurrentCycleNumber(currentStep)
  const isComplete = currentStep.type === 'complete'
  const isSummary = currentStep.type === 'summary'
  const isPostCycle = isSummary || isComplete

  const items: SidebarItem[] = [
    { id: 'details', label: 'Observation Details', status: 'completed' },
    { id: 'environment', label: 'Environment', status: 'completed' },
    ...Array.from({ length: observationMeta.numberOfCycles }, (_, index) => {
      const cycleNumber = index + 1
      let status: SidebarItem['status'] = 'upcoming'
      if (isPostCycle) status = 'completed'
      else if (currentCycle === cycleNumber) status = 'active'
      else if (currentCycle !== null && cycleNumber < currentCycle) status = 'completed'
      return {
        id: `cycle-${cycleNumber}`,
        label: `Cycle ${cycleNumber}`,
        status,
      }
    }),
    {
      id: 'evidence',
      label: 'Evidence',
      status: isPostCycle ? 'completed' : 'upcoming',
    },
    {
      id: 'summary',
      label: 'Summary',
      status: isComplete ? 'completed' : isSummary ? 'active' : 'locked',
    },
  ]

  return (
    <aside className="w-64 shrink-0 border-r border-gray-200 bg-white text-sm">
      <div className="sticky top-0 left-0 bg-white">
        <div className="bg-teachstone-teal px-4 py-3 text-sm font-bold leading-snug text-[var(--tw-ring-offset-color)]">
          {activeFlow.sidebar.title}
        </div>

        <nav
          className="flex flex-col gap-2 px-1 pt-2 pb-2"
          aria-label="Observation progress"
          aria-describedby={SIDEBAR_NOTICE_ID}
        >
          {items.map((item) => (
            <SidebarNavItem key={item.id} item={item} />
          ))}
        </nav>

        <div className="mt-6 border-t border-gray-200 py-4">
          <div
            id={SIDEBAR_NOTICE_ID}
            role="note"
            className="mx-4 mt-4 mb-4 rounded border border-amber-200 bg-[#FFFBEB] border-l-4 border-l-amber-500 px-3 py-2 text-xs text-amber-900"
          >
            <p className="mb-0.5 font-semibold text-amber-950">Preview only</p>
            <p>
              This sidebar shows the full observation flow. Use{' '}
              <span className="font-medium">Next</span> and{' '}
              <span className="font-medium">Back</span> at the bottom to move through this
              prototype.
            </p>
          </div>
        </div>
      </div>
    </aside>
  )
}
