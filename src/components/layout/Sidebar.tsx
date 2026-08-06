import { useState } from 'react'
import { getCurrentCycleNumber, usePrototype } from '../../context/PrototypeContext'
import {
  Check,
  CycleIcon,
  EvidenceIcon,
  PanelLeftCloseIcon,
  PanelLeftOpenIcon,
  SummaryIcon,
} from './icons'

const SIDEBAR_NOTICE_ID = 'sidebar-prototype-notice'
const SIDEBAR_COLLAPSED_KEY = 'class-notes-prototype-sidebar-collapsed'
const PREVIEW_TOOLTIP = 'Preview only — use Next to continue.'

type SidebarItemKind = 'completed-check' | 'cycle' | 'evidence' | 'summary'

type SidebarItem = {
  id: string
  label: string
  status: 'completed' | 'active' | 'upcoming' | 'locked'
  kind: SidebarItemKind
  cycleNumber?: number
}

function readCollapsedPreference(): boolean {
  try {
    return localStorage.getItem(SIDEBAR_COLLAPSED_KEY) === 'true'
  } catch {
    return false
  }
}

function writeCollapsedPreference(collapsed: boolean) {
  try {
    localStorage.setItem(SIDEBAR_COLLAPSED_KEY, String(collapsed))
  } catch {
    // ignore storage errors in prototype
  }
}

function CompletedCheckBadge({ size = 'sm' }: { size?: 'sm' | 'md' }) {
  const badgeSize = size === 'md' ? 'size-6' : 'size-4'
  const checkSize = size === 'md' ? 'size-3.5 text-white' : 'size-2.5 text-white'
  return (
    <span
      aria-label="Completed"
      className={`inline-flex shrink-0 items-center justify-center rounded-full bg-teachstone-complete ${badgeSize}`}
    >
      <Check className={checkSize} />
    </span>
  )
}

function SidebarItemIcon({ item, collapsed }: { item: SidebarItem; collapsed: boolean }) {
  const muted = item.status === 'locked' || item.status === 'upcoming'
  const iconTone = muted ? 'text-gray-400' : 'text-teachstone-slate'

  if (item.kind === 'completed-check') {
    return <CompletedCheckBadge size={collapsed ? 'md' : 'sm'} />
  }

  if (item.kind === 'cycle' && item.cycleNumber != null) {
    return (
      <CycleIcon
        cycleNumber={item.cycleNumber}
        className={`size-6 shrink-0 ${iconTone}`}
        aria-label={`Cycle ${item.cycleNumber}`}
      />
    )
  }

  if (item.kind === 'evidence') {
    return <EvidenceIcon className={`size-5 shrink-0 ${iconTone}`} />
  }

  return <SummaryIcon className={`size-5 shrink-0 ${iconTone}`} />
}

function SidebarNavItem({
  item,
  collapsed,
}: {
  item: SidebarItem
  collapsed: boolean
}) {
  const isActive = item.status === 'active'
  const tooltip = collapsed ? item.label : !isActive ? PREVIEW_TOOLTIP : null

  return (
    <div className="group relative mx-1 mb-1">
      <div
        aria-current={isActive ? 'step' : undefined}
        title={collapsed ? item.label : undefined}
        className={`flex items-center rounded px-3 py-2 text-sm ${
          collapsed ? 'justify-center px-2' : 'justify-between'
        } ${
          item.status === 'active'
            ? 'bg-gray-100 font-bold text-teachstone-navy'
            : item.status === 'locked'
              ? 'text-gray-400'
              : 'font-bold text-teachstone-slate'
        }`}
      >
        {collapsed ? (
          <SidebarItemIcon item={item} collapsed />
        ) : (
          <>
            <span>{item.label}</span>
            {item.status === 'completed' && <CompletedCheckBadge />}
          </>
        )}
      </div>

      {tooltip && (
        <span
          role="tooltip"
          className={`pointer-events-none absolute z-20 mt-1 w-max max-w-[220px] rounded-md bg-[#1A0238] px-3 py-1.5 text-xs font-medium leading-snug text-white opacity-0 shadow-lg transition-opacity duration-150 group-hover:opacity-100 group-focus-within:opacity-100 ${
            collapsed ? 'left-full top-1/2 ml-2 -translate-y-1/2' : 'left-0 top-full'
          }`}
        >
          {tooltip}
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
  const [collapsed, setCollapsed] = useState(readCollapsedPreference)

  function toggleCollapsed() {
    setCollapsed((prev) => {
      const next = !prev
      writeCollapsedPreference(next)
      return next
    })
  }

  const items: SidebarItem[] = [
    {
      id: 'details',
      label: 'Observation Details',
      status: 'completed',
      kind: 'completed-check',
    },
    {
      id: 'environment',
      label: 'Environment',
      status: 'completed',
      kind: 'completed-check',
    },
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
        kind: 'cycle' as const,
        cycleNumber,
      }
    }),
    {
      id: 'evidence',
      label: 'Evidence',
      status: isPostCycle ? 'completed' : 'upcoming',
      kind: 'evidence',
    },
    {
      id: 'summary',
      label: 'Summary',
      status: isComplete ? 'completed' : isSummary ? 'active' : 'locked',
      kind: 'summary',
    },
  ]

  return (
    <aside
      className={`shrink-0 border-r border-gray-200 bg-white text-sm transition-[width] duration-200 ease-out ${
        collapsed ? 'w-14' : 'w-64'
      }`}
    >
      <div className="sticky top-0 left-0 bg-white">
        <div
          className={`flex items-center gap-2 bg-teachstone-teal py-3 text-sm font-bold leading-snug text-white ${
            collapsed ? 'justify-center px-1' : 'justify-between px-3'
          }`}
        >
          {!collapsed && (
            <span className="min-w-0 flex-1 text-[var(--tw-ring-offset-color)]">
              {activeFlow.sidebar.title}
            </span>
          )}
          <button
            type="button"
            onClick={toggleCollapsed}
            aria-expanded={!collapsed}
            aria-controls="observation-sidebar-nav"
            aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
            className="inline-flex size-8 shrink-0 items-center justify-center rounded text-white transition hover:bg-white/15 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
          >
            {collapsed ? (
              <PanelLeftOpenIcon className="size-5" />
            ) : (
              <PanelLeftCloseIcon className="size-5" />
            )}
          </button>
        </div>

        <nav
          id="observation-sidebar-nav"
          className="flex flex-col gap-2 px-1 pt-2 pb-2"
          aria-label="Observation progress"
          aria-describedby={collapsed ? undefined : SIDEBAR_NOTICE_ID}
        >
          {items.map((item) => (
            <SidebarNavItem key={item.id} item={item} collapsed={collapsed} />
          ))}
        </nav>

        {!collapsed && (
          <div className="mt-6 border-t border-gray-200 py-4">
            <div
              id={SIDEBAR_NOTICE_ID}
              role="note"
              className="mx-4 mt-4 mb-4 rounded border border-amber-200 border-l-4 border-l-amber-500 bg-[#FFFBEB] px-3 py-2 text-xs text-amber-900"
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
        )}
      </div>
    </aside>
  )
}
