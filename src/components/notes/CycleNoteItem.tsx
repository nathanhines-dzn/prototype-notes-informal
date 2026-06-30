import { useEffect, useState } from 'react'
import type { ClassDimension, CycleNote } from '../../types'
import { Trash } from '../layout/icons'
import { DimensionSelect } from './DimensionSelect'

type CycleNoteItemProps = {
  note: CycleNote
  dimensions: ClassDimension[]
  variant?: 'grouped' | 'unassigned'
  onUpdate: (patch: Partial<Pick<CycleNote, 'text' | 'dimensionId'>>) => void
  onDelete: () => void
}

export function CycleNoteItem({
  note,
  dimensions,
  variant = 'unassigned',
  onUpdate,
  onDelete,
}: CycleNoteItemProps) {
  const [text, setText] = useState(note.text)

  useEffect(() => {
    setText(note.text)
  }, [note.text])

  const handleBlur = () => {
    const trimmed = text.trim()
    if (!trimmed) {
      setText(note.text)
      return
    }
    if (trimmed !== note.text) {
      onUpdate({ text: trimmed })
    }
  }

  return (
    <article>
      {variant === 'unassigned' && (
        <div className="mb-3 flex items-center justify-between gap-4">
          <span className="inline-block rounded border border-gray-200 bg-[#f8f9fa] px-1.5 py-0.5 text-xs text-teachstone-muted">
            Not assigned
          </span>
          <div className="flex shrink-0 items-center gap-2">
            <DimensionSelect
              id={`note-dimension-${note.id}`}
              dimensions={dimensions}
              value={note.dimensionId}
              onChange={(dimensionId) => onUpdate({ dimensionId })}
            />
            <button
              type="button"
              onClick={onDelete}
              aria-label="Delete note"
              className="flex size-8 shrink-0 items-center justify-center rounded-lg text-red-600 transition hover:bg-red-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-600"
            >
              <Trash className="size-4" />
            </button>
          </div>
        </div>
      )}

      {variant === 'grouped' && (
        <div className="mb-2 flex justify-end">
          <button
            type="button"
            onClick={onDelete}
            aria-label="Delete note"
            className="flex size-8 shrink-0 items-center justify-center rounded-lg text-red-600 transition hover:bg-red-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-600"
          >
            <Trash className="size-4" />
          </button>
        </div>
      )}

      <textarea
        value={text}
        onChange={(event) => setText(event.target.value)}
        onBlur={handleBlur}
        rows={3}
        className="w-full resize-y rounded-lg border border-gray-300 bg-white px-4 py-3 text-sm text-teachstone-navy outline-none focus:ring-1 focus:ring-teachstone-teal"
      />
    </article>
  )
}
