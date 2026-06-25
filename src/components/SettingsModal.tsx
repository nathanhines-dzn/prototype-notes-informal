import { useCallback, useEffect, useRef, useState } from 'react'
import { FLOWS } from '../config/flows'
import { usePrototype } from '../context/PrototypeContext'
import { buildFlowShareUrl } from '../utils/flowUrl'

function LinkIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 20 20"
      fill="currentColor"
      className="size-4"
      aria-hidden
    >
      <path d="M12.232 4.232a2.5 2.5 0 0 1 3.536 3.536l-1.225 1.224a.75.75 0 0 0 1.061 1.06l1.224-1.224a4 4 0 0 0-5.656-5.656l-3 3a4 4 0 0 0 .225 5.865.75.75 0 0 0 .977-1.138 2.5 2.5 0 0 1-.142-3.667l3-3Z" />
      <path d="M11.603 7.963a.75.75 0 0 0-.977 1.138 2.5 2.5 0 0 1 .142 3.667l-3 3a2.5 2.5 0 0 1-3.536-3.536l1.225-1.224a.75.75 0 0 0-1.061-1.06l-1.224 1.224a4 4 0 0 0 5.656 5.656l3-3a4 4 0 0 0-.225-5.865Z" />
    </svg>
  )
}

type CopyLinkButtonProps = {
  flowId: string
  flowLabel: string
}

function CopyLinkButton({ flowId, flowLabel }: CopyLinkButtonProps) {
  const [copied, setCopied] = useState(false)
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const tooltipLabel = `Copy share link for ${flowLabel}`

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }
    }
  }, [])

  const handleCopy = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(buildFlowShareUrl(flowId))
      setCopied(true)
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }
      timeoutRef.current = setTimeout(() => setCopied(false), 2000)
    } catch {
      // ignore clipboard errors in prototype
    }
  }, [flowId])

  return (
    <div className="group relative shrink-0">
      <button
        type="button"
        onClick={handleCopy}
        aria-label={tooltipLabel}
        className="inline-flex items-center gap-1.5 rounded-md border border-gray-200 px-2.5 py-1.5 text-xs font-medium text-teachstone-slate transition hover:bg-gray-50 hover:text-teachstone-navy focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teachstone-teal"
      >
        <LinkIcon />
        {copied ? 'Copied!' : 'Link'}
      </button>
      <span
        role="tooltip"
        className="pointer-events-none absolute bottom-full right-0 z-20 mb-2 whitespace-nowrap rounded-md bg-[#1A0238] px-3 py-1.5 text-xs font-medium text-white opacity-0 shadow-lg transition-opacity duration-150 group-hover:opacity-100"
      >
        {tooltipLabel}
      </span>
    </div>
  )
}

export function SettingsModal() {
  const { settingsOpen, setSettingsOpen, activeFlowId, setActiveFlow } = usePrototype()

  if (!settingsOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="settings-title"
        className="w-full max-w-md rounded-xl bg-white p-6 shadow-xl"
      >
        <h2 id="settings-title" className="text-xl font-semibold text-teachstone-navy">
          Prototype Settings
        </h2>
        <p className="mt-2 text-sm text-gray-500">
          Switching flow will restart the prototype from the create observation screen.
        </p>

        <fieldset className="mt-6 space-y-3">
          <legend className="mb-2 text-sm font-medium text-teachstone-slate">Observation flow</legend>
          {FLOWS.map((flow) => (
            <div
              key={flow.id}
              className="flex items-center gap-3 rounded-lg border border-gray-200 px-4 py-3 hover:bg-gray-50"
            >
              <label className="flex min-w-0 flex-1 cursor-pointer items-center gap-3">
                <input
                  type="radio"
                  name="flow"
                  value={flow.id}
                  checked={activeFlowId === flow.id}
                  onChange={() => {
                    setActiveFlow(flow.id)
                    setSettingsOpen(false)
                  }}
                  className="h-4 w-4 shrink-0 accent-teachstone-teal"
                />
                <span className="text-base text-teachstone-navy">{flow.label}</span>
              </label>
              <CopyLinkButton flowId={flow.id} flowLabel={flow.label} />
            </div>
          ))}
        </fieldset>

        <div className="mt-6 flex justify-end">
          <button
            type="button"
            onClick={() => setSettingsOpen(false)}
            className="rounded bg-teachstone-teal px-5 py-2 text-sm font-medium text-white hover:bg-[#016688]"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  )
}
