import { useEffect, useId, useRef, useState } from 'react'
import type { ClassDimension } from '../../types'
import { ChevronDown } from '../layout/icons'

type DimensionSelectProps = {
  id: string
  dimensions: ClassDimension[]
  value: string | null
  onChange: (dimensionId: string | null) => void
  className?: string
}

export function DimensionSelect({
  id,
  dimensions,
  value,
  onChange,
  className = '',
}: DimensionSelectProps) {
  const [open, setOpen] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)
  const listboxId = useId()

  const selectedDimension = dimensions.find((dimension) => dimension.id === value)
  const displayValue = selectedDimension ? selectedDimension.name : 'Not assigned'

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

  const handleSelect = (dimensionId: string | null) => {
    onChange(dimensionId)
    setOpen(false)
  }

  return (
    <div ref={containerRef} className={`relative ${className}`}>
      <button
        type="button"
        id={id}
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-controls={listboxId}
        onClick={() => setOpen((current) => !current)}
        className="flex items-center gap-0.5 rounded-full border border-[#d1d5dc] bg-white px-2 py-1 shadow-[0px_1px_0.5px_rgba(0,0,0,0.04),0px_0px_0px_rgba(0,0,0,0.04)]"
      >
        <span className="px-0.5 text-sm font-semibold leading-5 text-[#706f77]">Dimension</span>
        <span className="mx-0.5 h-3.5 w-px shrink-0 bg-black/10" aria-hidden />
        <span className="flex items-center gap-1 px-0.5">
          <span className="text-sm font-semibold leading-5 text-[#1a0238]">{displayValue}</span>
          <ChevronDown className="size-4 shrink-0 text-[#706f77]" />
        </span>
      </button>

      {open && (
        <ul
          id={listboxId}
          role="listbox"
          aria-labelledby={id}
          className="absolute right-0 z-10 mt-1 max-h-60 w-max min-w-full overflow-y-auto rounded-lg border border-gray-200 bg-white py-1 shadow-lg"
        >
          <li
            role="option"
            aria-selected={value === null}
            onClick={() => handleSelect(null)}
            className={`cursor-pointer whitespace-nowrap px-3 py-2 text-sm ${
              value === null
                ? 'bg-teachstone-card font-semibold text-[#1a0238]'
                : 'text-teachstone-navy hover:bg-gray-50'
            }`}
          >
            Not assigned
          </li>
          {dimensions.map((dimension) => (
            <li
              key={dimension.id}
              role="option"
              aria-selected={value === dimension.id}
              onClick={() => handleSelect(dimension.id)}
              className={`cursor-pointer whitespace-nowrap px-3 py-2 text-sm ${
                value === dimension.id
                  ? 'bg-teachstone-card font-semibold text-[#1a0238]'
                  : 'text-teachstone-navy hover:bg-gray-50'
              }`}
            >
              {dimension.name}
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
