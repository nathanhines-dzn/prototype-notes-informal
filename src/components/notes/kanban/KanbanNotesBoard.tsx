import {
  DndContext,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from '@dnd-kit/core'
import { useToast } from '../../../context/ToastContext'
import type { ClassDimension, CycleNote } from '../../../types'
import { KanbanColumn } from './KanbanColumn'
import {
  buildKanbanColumns,
  getKanbanColumnIdForNote,
  getNotesForKanbanColumn,
  getOrderedDimensions,
  UNASSIGNED_COLUMN_ID,
} from './kanbanUtils'

type KanbanNotesBoardProps = {
  notes: CycleNote[]
  dimensions: ClassDimension[]
  onUpdateNote: (
    noteId: string,
    patch: Partial<Pick<CycleNote, 'text' | 'dimensionId'>>,
  ) => void
  onDeleteNote: (noteId: string) => void
}

export function KanbanNotesBoard({
  notes,
  dimensions,
  onUpdateNote,
  onDeleteNote,
}: KanbanNotesBoardProps) {
  const { showToast } = useToast()
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: { distance: 8 },
    }),
  )

  const orderedDimensions = getOrderedDimensions(dimensions)
  const columns = buildKanbanColumns(orderedDimensions)

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event
    if (!over) return

    const noteId = String(active.id)
    const targetColumnId = String(over.id)
    const note = notes.find((entry) => entry.id === noteId)
    if (!note) return

    const currentColumnId = getKanbanColumnIdForNote(note, dimensions)
    if (currentColumnId === targetColumnId) return

    const targetDimensionId = targetColumnId === UNASSIGNED_COLUMN_ID ? null : targetColumnId
    onUpdateNote(noteId, { dimensionId: targetDimensionId })

    if (targetDimensionId == null) {
      showToast('Note moved to Unassigned')
      return
    }

    const dimension = dimensions.find((entry) => entry.id === targetDimensionId)
    showToast(dimension ? `Note moved to ${dimension.name}` : 'Note moved')
  }

  if (notes.length === 0) {
    return (
      <div className="border-t border-gray-100 pt-5">
        <div className="rounded-lg border border-gray-200 bg-[#f4f8fa] px-6 py-8 text-center">
          <p className="text-sm font-semibold text-teachstone-navy">Your notes will show up here.</p>
          <p className="mt-1 text-sm text-teachstone-muted">
            Tag a dimension to link them to scores.
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="border-t border-gray-100 pt-6">
      <div className="-mx-1 overflow-x-auto px-1 pb-2">
        <DndContext sensors={sensors} onDragEnd={handleDragEnd}>
          <div className="flex w-max min-w-full gap-4">
            {columns.map((column) => (
              <KanbanColumn
                key={column.columnId}
                columnId={column.columnId}
                title={column.title}
                notes={getNotesForKanbanColumn(column.columnId, notes, dimensions)}
                onUpdateNote={onUpdateNote}
                onDeleteNote={onDeleteNote}
              />
            ))}
          </div>
        </DndContext>
      </div>
    </div>
  )
}
