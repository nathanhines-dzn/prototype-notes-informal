import type { ReactNode } from 'react'
import settingsIcon from '../../assets/icon-settings-sliders.svg'
import restartIcon from '../../assets/icon-restart.svg'
import { usePrototype } from '../../context/PrototypeContext'

type ActionButtonProps = {
  label: string
  onClick: () => void
  children: ReactNode
}

function ActionButton({ label, onClick, children }: ActionButtonProps) {
  return (
    <div className="group relative">
      <button
        type="button"
        onClick={(event) => {
          onClick()
          event.currentTarget.blur()
        }}
        aria-label={label}
        className="flex size-10 cursor-pointer items-center justify-center rounded-full bg-[#1A0238] text-white shadow-lg transition hover:bg-[#250449] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#5D00D2]"
      >
        {children}
      </button>

      <span
        role="tooltip"
        className="pointer-events-none absolute bottom-full left-0 z-20 mb-2 whitespace-nowrap rounded-md bg-[#1A0238] px-3 py-1.5 text-xs font-medium text-white opacity-0 shadow-lg transition-opacity duration-150 group-hover:opacity-100"
      >
        {label}
      </span>
    </div>
  )
}

export function PrototypeActionButtons() {
  const { setSettingsOpen, restart } = usePrototype()

  return (
    <div className="flex items-center gap-3.5">
      <ActionButton label="Prototype settings" onClick={() => setSettingsOpen(true)}>
        <img src={settingsIcon} alt="" className="size-4" />
      </ActionButton>

      <ActionButton label="Restart prototype" onClick={restart}>
        <img src={restartIcon} alt="" className="size-4" />
      </ActionButton>
    </div>
  )
}
