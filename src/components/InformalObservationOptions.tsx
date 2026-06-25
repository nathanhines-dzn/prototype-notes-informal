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
    setAllDimensionsRowChecked,
    toggleDimensionInSelection,
    removeDimensionFromSelection,
  } = usePrototype()
  const [open, setOpen] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)

  const selectedDimensions = CLASS_DIMENSIONS.filter((dimension) =>
    includeAllDimensions ? true : focusedDimensionIds.includes(dimension.id),
  )

  const toggleAllDimensions = () => {
    setAllDimensionsRowChecked(!includeAllDimensions)
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
      <h2 className="mb-3 text-xl font-semibold text-teachstone-slate">Informal Observation Options</h2>

      <div className="w-full max-w-md py-2">
        <label className="mb-1 block text-base text-teachstone-slate">
          Dimension(s) of Focus
          {!includeAllDimensions && <span className="text-red-700">*</span>}
        </label>

        <div ref={containerRef} className="relative">
          <button
            type="button"
            aria-expanded={open}
            aria-haspopup="listbox"
            onClick={() => setOpen((current) => !current)}
            className="flex min-h-10 w-full items-center justify-between gap-2 rounded border border-gray-300 bg-white px-3 py-2 text-left text-base text-teachstone-slate hover:border-gray-400"
          >
            <span className="flex min-h-6 flex-1 flex-wrap items-center gap-2">
              {includeAllDimensions ? (
                <span>All dimensions</span>
              ) : selectedDimensions.length > 0 ? (
                selectedDimensions.map((dimension) => (
                  <DimensionPill
                    key={dimension.id}
                    label={`${dimension.name} (${dimension.abbr})`}
                    onRemove={() => removeDimensionFromSelection(dimension.id)}
                  />
                ))
              ) : (
                <span className="text-gray-500">Select dimension(s) to include</span>
              )}
            </span>
            <span className="shrink-0 text-gray-400">▾</span>
          </button>

          {open && (
            <ul
              role="listbox"
              aria-multiselectable="true"
              className="absolute z-10 mt-1 max-h-72 w-full overflow-y-auto rounded border border-gray-300 bg-white py-1 shadow-lg"
            >
              <li role="option" aria-selected={includeAllDimensions}>
                <label className="flex cursor-pointer items-center gap-3 border-b border-gray-100 px-4 py-2.5 hover:bg-gray-50">
                  <input
                    type="checkbox"
                    checked={includeAllDimensions}
                    onChange={toggleAllDimensions}
                    className="h-4 w-4 accent-teachstone-teal"
                  />
                  <span className="text-sm font-medium text-teachstone-slate">All dimensions</span>
                </label>
              </li>
              {CLASS_DIMENSIONS.map((dimension) => {
                const selected = includeAllDimensions || focusedDimensionIds.includes(dimension.id)
                return (
                  <li key={dimension.id} role="option" aria-selected={selected}>
                    <label
                      className={`flex items-center gap-3 px-4 py-2 hover:bg-gray-50 ${
                        includeAllDimensions ? 'cursor-default' : 'cursor-pointer'
                      }`}
                    >
                      <input
                        type="checkbox"
                        checked={selected}
                        onChange={() => toggleDimensionInSelection(dimension.id)}
                        className="h-4 w-4 accent-teachstone-teal"
                      />
                      <span
                        className={`text-sm ${
                          includeAllDimensions ? 'text-teachstone-muted' : 'text-teachstone-slate'
                        }`}
                      >
                        {dimension.name} ({dimension.abbr})
                      </span>
                    </label>
                  </li>
                )
              })}
            </ul>
          )}
        </div>

        <p className="mt-2 text-sm text-teachstone-muted">
          {includeAllDimensions
            ? 'All dimensions are included by default. Uncheck any dimension to limit what appears in Enter Ranges.'
            : focusedDimensionIds.length > 0
              ? 'Only the dimensions you selected will appear in Enter Ranges.'
              : 'Select at least one dimension, or choose All dimensions to include every dimension.'}
        </p>

        {!includeAllDimensions && focusedDimensionIds.length === 0 && (
          <p className="mt-2 text-sm text-red-700">Select at least one dimension to continue.</p>
        )}
      </div>
    </section>
  )
}
