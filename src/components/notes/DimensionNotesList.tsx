import { useEffect, useState } from 'react'
import type { CycleNote } from '../../types'
import { notesToDisplayOrder } from '../../utils/dimensionBulletNotes'
import { ChevronDown } from '../layout/icons'

type DimensionNotesListProps = {
  notes: CycleNote[]
}

export function DimensionNotesList({ notes }: DimensionNotesListProps) {
  const [expanded, setExpanded] = useState(notes.length > 0)
  const displayNotes = notesToDisplayOrder(notes)

  useEffect(() => {
    if (notes.length > 0) {
      setExpanded(true)
    }
  }, [notes.length])

  return (
    <div className="rounded-lg border border-gray-100 bg-[#fafbfc]">
      <button
        type="button"
        onClick={() => setExpanded((current) => !current)}
        aria-expanded={expanded}
        className="flex w-full items-center gap-2 px-4 py-3 text-left"
      >
        <ChevronDown
          className={`size-4 shrink-0 text-teachstone-muted transition ${expanded ? '' : '-rotate-90'}`}
        />
        <span className="text-sm font-semibold text-teachstone-navy">Observation Notes</span>
        <span className="shrink-0 text-sm text-teachstone-muted">({notes.length})</span>
      </button>

      {expanded && (
        <div className="border-t border-gray-100 px-4 py-3">
          {notes.length === 0 ? (
            <div className="space-y-1 py-2">
              <p className="text-sm text-teachstone-navy">No notes for this dimension yet.</p>
              <p className="text-sm text-teachstone-muted">
                Tagged notes from this cycle will appear here when you score.
              </p>
            </div>
          ) : (
            <ul className="space-y-1">
              {displayNotes.map((note) => (
                <li
                  key={note.id}
                  className="flex gap-2 text-sm leading-snug text-teachstone-navy"
                >
                  <span className="shrink-0 text-teachstone-muted" aria-hidden="true">
                    •
                  </span>
                  <span className="min-w-0 whitespace-pre-wrap">{note.text}</span>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  )
}
