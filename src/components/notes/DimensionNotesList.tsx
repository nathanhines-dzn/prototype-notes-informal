import type { CycleNote } from '../../types'

type DimensionNotesListProps = {
  notes: CycleNote[]
}

export function DimensionNotesList({ notes }: DimensionNotesListProps) {
  if (notes.length === 0) {
    return (
      <div className="space-y-1 rounded-lg bg-white/50 px-4 py-6">
        <p className="text-base text-teachstone-navy">No notes for this dimension yet.</p>
        <p className="text-sm text-teachstone-muted">
          Tagged notes from this cycle will appear here when you score.
        </p>
      </div>
    )
  }

  return (
    <div className="space-y-3">
      <h3 className="text-base text-teachstone-navy">Observation Notes</h3>
      <div className="space-y-3">
        {notes.map((note) => (
          <article
            key={note.id}
            className="rounded-lg border border-gray-200 bg-white p-3"
          >
            <p className="whitespace-pre-wrap text-sm leading-relaxed text-gray-900">{note.text}</p>
          </article>
        ))}
      </div>
    </div>
  )
}
