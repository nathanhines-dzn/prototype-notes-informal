import { useDroppable } from '@dnd-kit/core'
import type { CycleNote } from '../../../types'
import { KanbanNoteCard } from './KanbanNoteCard'

type KanbanColumnProps = {
  columnId: string
  title: string
  notes: CycleNote[]
  onUpdateNote: (
    noteId: string,
    patch: Partial<Pick<CycleNote, 'text' | 'dimensionId'>>,
  ) => void
  onDeleteNote: (noteId: string) => void
}

export function KanbanColumn({
  columnId,
  title,
  notes,
  onUpdateNote,
  onDeleteNote,
}: KanbanColumnProps) {
  const { setNodeRef, isOver } = useDroppable({ id: columnId })

  return (
    <section
      ref={setNodeRef}
      className={`flex min-h-48 w-[260px] shrink-0 flex-col rounded-xl border bg-[#f8f9fa] transition ${
        isOver ? 'border-teachstone-teal bg-teal-50/50' : 'border-gray-200'
      }`}
    >
      <header className="border-b border-gray-200 px-4 py-3">
        <div className="flex items-baseline justify-between gap-2">
          <h3
            className="min-w-0 flex-1 truncate text-sm font-semibold text-teachstone-navy"
            title={title}
          >
            {title}
          </h3>
          <span className="shrink-0 rounded-full bg-white px-2 py-0.5 text-xs text-teachstone-muted">
            {notes.length}
          </span>
        </div>
      </header>

      <div className="flex flex-1 flex-col gap-2 p-3">
        {notes.length === 0 ? (
          <p className="py-6 text-center text-xs text-teachstone-muted">No notes</p>
        ) : (
          notes.map((note) => (
            <KanbanNoteCard
              key={note.id}
              note={note}
              onUpdate={(patch) => onUpdateNote(note.id, patch)}
              onDelete={() => onDeleteNote(note.id)}
            />
          ))
        )}
      </div>
    </section>
  )
}
