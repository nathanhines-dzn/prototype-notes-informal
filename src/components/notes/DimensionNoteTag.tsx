import { useEffect, useId, useRef, useState } from 'react'
import type { ClassDimension } from '../../types'
import { ChevronDown } from '../layout/icons'
import { getDimensionTagColor } from './dimensionTagColors'

type DimensionNoteTagProps = {
  id: string
  dimensions: ClassDimension[]
  value: string | null
  onChange: (dimensionId: string | null) => void
  className?: string
}

export function DimensionNoteTag({
  id,
  dimensions,
  value,
  onChange,
  className = '',
}: DimensionNoteTagProps) {
  const [open, setOpen] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)
  const listboxId = useId()

  const selectedDimension = dimensions.find((dimension) => dimension.id === value)
  const displayValue = selectedDimension ? selectedDimension.name : 'Not assigned'
  const colors = getDimensionTagColor(value)

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
    <div
      ref={containerRef}
      className={`relative shrink-0 ${className}`}
      onMouseDown={(event) => {
        // Keep text caret from moving when interacting with the tag.
        event.preventDefault()
      }}
    >
      <button
        type="button"
        id={id}
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-controls={listboxId}
        onClick={(event) => {
          event.stopPropagation()
          setOpen((current) => !current)
        }}
        className={`inline-flex max-w-[14rem] items-center gap-0.5 rounded-full border px-2 py-0.5 ${colors.bg} ${colors.border}`}
      >
        <span className={`truncate text-xs font-semibold leading-4 ${colors.text}`}>
          {displayValue}
        </span>
        <ChevronDown className={`size-3.5 shrink-0 ${colors.text}`} />
      </button>

      {open && (
        <ul
          id={listboxId}
          role="listbox"
          aria-labelledby={id}
          className="absolute right-0 z-20 mt-1 max-h-60 w-max min-w-[10rem] overflow-y-auto rounded-lg border border-gray-200 bg-white py-1 shadow-lg"
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
