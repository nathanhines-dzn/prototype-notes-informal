import { useId, type ReactNode } from 'react'

type ShortcutItem = {
  keys: string[]
  action: string
}

type KeyboardShortcutHintProps = {
  shortcuts: ShortcutItem[]
  label?: string
}

function Kbd({ children }: { children: ReactNode }) {
  return (
    <kbd className="inline-flex min-h-[22px] min-w-[22px] items-center justify-center rounded border border-gray-200 bg-white px-1.5 font-sans text-xs font-medium text-teachstone-navy shadow-[0_1px_0_rgba(0,0,0,0.04)]">
      {children}
    </kbd>
  )
}

function Shortcut({ keys, action }: ShortcutItem) {
  return (
    <span className="inline-flex items-center gap-1">
      {keys.map((key, index) => (
        <span key={`${key}-${index}`} className="inline-flex items-center gap-1">
          {index > 0 && <span className="text-teachstone-muted">+</span>}
          <Kbd>{key}</Kbd>
        </span>
      ))}
      <span>{action}</span>
    </span>
  )
}

export function KeyboardShortcutHint({ shortcuts, label }: KeyboardShortcutHintProps) {
  const labelId = useId()

  return (
    <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-teachstone-muted">
      {label && (
        <span id={labelId} className="shrink-0 font-medium text-teachstone-navy/70">
          {label}
        </span>
      )}
      <p
        className="flex flex-wrap items-center gap-x-2 gap-y-1"
        aria-labelledby={label ? labelId : undefined}
      >
        {shortcuts.map((shortcut) => (
          <span key={shortcut.action} className="inline-flex items-center gap-2">
            <Shortcut keys={shortcut.keys} action={shortcut.action} />
          </span>
        ))}
      </p>
    </div>
  )
}
