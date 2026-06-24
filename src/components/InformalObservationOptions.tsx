import { useEffect, useRef, useState } from 'react'
import { CLASS_DIMENSIONS } from '../data/classDimensions'
import { usePrototype } from '../context/PrototypeContext'

function DimensionPill({
  label,
  onRemove,
}: {
  label: string
  onRemove: () => void
}) {
  return (
    <span className="inline-flex items-center gap-1 rounded bg-gray-200 px-2 py-1 text-xs text-gray-700">
      {label}
      <button
        type="button"
        onClick={(event) => {
          event.stopPropagation()
          onRemove()
        }}
        className="text-gray-500 hover:text-gray-800"
        aria-label={`Remove ${label}`}
      >
        ×
      </button>
    </span>
  )
}

export function InformalObservationOptions() {
  const {
    includeAllDimensions,
    focusedDimensionIds,
    setIncludeAllDimensions,
    setFocusedDimensionIds,
  } = usePrototype()
  const [open, setOpen] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)

  const disabled = includeAllDimensions
  const selectedDimensions = CLASS_DIMENSIONS.filter((dimension) =>
    focusedDimensionIds.includes(dimension.id),
  )

  const toggleDimension = (dimensionId: string) => {
    if (focusedDimensionIds.includes(dimensionId)) {
      setFocusedDimensionIds(focusedDimensionIds.filter((id) => id !== dimensionId))
      return
    }
    setFocusedDimensionIds([...focusedDimensionIds, dimensionId])
  }

  useEffect(() => {
    if (!open) return

    const handlePointerDown = (event: MouseEvent) => {
      if (!containerRef.current?.contains(event.target as Node)) {
        setOpen(false)
      }
    }

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setOpen(false)
      }
    }

    document.addEventListener('mousedown', handlePointerDown)
    document.addEventListener('keydown', handleKeyDown)
    return () => {
      document.removeEventListener('mousedown', handlePointerDown)
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [open])

  return (
    <section className="mt-8 border-t border-gray-100 pt-5">
      <h2 className="mb-3 text-xl text-teachstone-slate">Informal Observation Options</h2>

      <div className="space-y-2 py-2">
        <label className="flex items-center gap-3 text-base text-teachstone-slate">
          <input
            type="checkbox"
            checked={includeAllDimensions}
            onChange={(event) => setIncludeAllDimensions(event.target.checked)}
            className="h-4 w-4 accent-teachstone-teal"
          />
          Include All Dimensions
        </label>

        <div className="w-full max-w-md pt-1">
          <label
            className={`mb-1 block text-base ${disabled ? 'text-gray-400' : 'text-teachstone-slate'}`}
          >
            Dimension(s) of Focus
            {!disabled && <span className="text-red-700">*</span>}
          </label>

          <div ref={containerRef} className="relative">
            <button
              type="button"
              disabled={disabled}
              aria-expanded={open}
              aria-haspopup="listbox"
              onClick={() => {
                if (!disabled) {
                  setOpen((current) => !current)
                }
              }}
              className={`flex min-h-10 w-full items-center justify-between gap-2 rounded border px-3 py-2 text-left text-base ${
                disabled
                  ? 'cursor-not-allowed border-gray-200 bg-gray-50 text-gray-400'
                  : 'border-gray-300 bg-white text-teachstone-slate hover:border-gray-400'
              }`}
            >
              <span className="flex min-h-6 flex-1 flex-wrap items-center gap-2">
                {selectedDimensions.length > 0 ? (
                  selectedDimensions.map((dimension) => (
                    <DimensionPill
                      key={dimension.id}
                      label={`${dimension.name} (${dimension.abbr})`}
                      onRemove={() => toggleDimension(dimension.id)}
                    />
                  ))
                ) : (
                  <span className={disabled ? 'text-gray-400' : 'text-gray-500'}>
                    Select dimension(s) to include
                  </span>
                )}
              </span>
              <span className="shrink-0 text-gray-400">▾</span>
            </button>

            {open && !disabled && (
              <ul
                role="listbox"
                aria-multiselectable="true"
                className="absolute z-10 mt-1 max-h-60 w-full overflow-y-auto rounded border border-gray-300 bg-white py-1 shadow-lg"
              >
                {CLASS_DIMENSIONS.map((dimension) => {
                  const selected = focusedDimensionIds.includes(dimension.id)
                  return (
                    <li key={dimension.id} role="option" aria-selected={selected}>
                      <label className="flex cursor-pointer items-center gap-3 px-4 py-2 hover:bg-gray-50">
                        <input
                          type="checkbox"
                          checked={selected}
                          onChange={() => toggleDimension(dimension.id)}
                          className="h-4 w-4 accent-teachstone-teal"
                        />
                        <span className="text-sm text-teachstone-slate">
                          {dimension.name} ({dimension.abbr})
                        </span>
                      </label>
                    </li>
                  )
                })}
              </ul>
            )}
          </div>

          {!includeAllDimensions && focusedDimensionIds.length === 0 && (
            <p className="mt-2 text-sm text-red-700">Select at least one dimension to continue.</p>
          )}
        </div>
      </div>
    </section>
  )
}
