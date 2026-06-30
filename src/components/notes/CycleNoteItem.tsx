import { useEffect, useState } from 'react'
import type { ClassDimension, CycleNote } from '../../types'
import { Trash } from '../layout/icons'
import { DimensionSelect } from './DimensionSelect'

type CycleNoteItemProps = {
  note: CycleNote
  dimensions: ClassDimension[]
  onUpdate: (patch: Partial<Pick<CycleNote, 'text' | 'dimensionId'>>) => void
  onDelete: () => void
}

export function CycleNoteItem({ note, dimensions, onUpdate, onDelete }: CycleNoteItemProps) {
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
      <div className="mb-3 flex items-center justify-between gap-4">
        {note.dimensionId == null ? (
          <span className="inline-block rounded border border-gray-200 bg-[#f8f9fa] px-1.5 py-0.5 text-xs text-teachstone-muted">
            No dimension
          </span>
        ) : (
          <span className="inline-block rounded border border-teachstone-teal/30 bg-teachstone-teal/5 px-1.5 py-0.5 text-sm font-medium text-teachstone-teal">
            {dimensions.find((d) => d.id === note.dimensionId)?.name ?? note.dimensionId}
          </span>
        )}
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
      <textarea
        value={text}
        onChange={(event) => setText(event.target.value)}
        onBlur={handleBlur}
        rows={3}
        className="w-full resize-y rounded-lg border-0 bg-[#f8f9fa] px-4 py-3 text-sm text-teachstone-navy outline-none focus:ring-1 focus:ring-teachstone-teal"
      />
    </article>
  )
}
