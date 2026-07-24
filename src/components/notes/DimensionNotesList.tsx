import type { CycleNote } from '../../types'
import { notesToDisplayOrder } from '../../utils/dimensionBulletNotes'

const EMPTY_NOTES_COPY = 'No notes yet. Add one for this dimension in the section above.'

type DimensionNotesListProps = {
  notes: CycleNote[]
}

export function DimensionNotesList({ notes }: DimensionNotesListProps) {
  const displayNotes = notesToDisplayOrder(notes)

  return (
    <div className="flex w-full flex-col gap-6 pt-6">
      <div className="flex flex-col gap-2 text-base">
        <p className="font-bold text-teachstone-navy">Observation Notes</p>
        {notes.length === 0 ? (
          <p className="leading-normal text-teachstone-muted">{EMPTY_NOTES_COPY}</p>
        ) : (
          <ul className="space-y-1">
            {displayNotes.map((note) => (
              <li
                key={note.id}
                className="flex gap-2 leading-snug text-teachstone-navy"
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
      <div className="h-[3px] w-full border-t-[3px] border-white" />
    </div>
  )
}
