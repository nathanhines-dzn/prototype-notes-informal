import type { ClassDimension, CycleNote } from '../../../types'
import { groupDimensionsByDomain } from '../../../utils/groupDimensionsByDomain'

export const UNASSIGNED_COLUMN_ID = 'unassigned'

export type KanbanColumnConfig = {
  columnId: string
  title: string
}

export function getOrderedDimensions(dimensions: ClassDimension[]): ClassDimension[] {
  return groupDimensionsByDomain(dimensions).flatMap((group) => group.dimensions)
}

export function buildKanbanColumns(dimensions: ClassDimension[]): KanbanColumnConfig[] {
  return [
    { columnId: UNASSIGNED_COLUMN_ID, title: 'Unassigned' },
    ...dimensions.map((dimension) => ({
      columnId: dimension.id,
      title: dimension.name,
    })),
  ]
}

export function getNotesForKanbanColumn(
  columnId: string,
  notes: CycleNote[],
  dimensions: ClassDimension[],
): CycleNote[] {
  const activeDimensionIds = new Set(dimensions.map((dimension) => dimension.id))

  if (columnId === UNASSIGNED_COLUMN_ID) {
    return notes.filter(
      (note) => note.dimensionId == null || !activeDimensionIds.has(note.dimensionId),
    )
  }

  return notes.filter((note) => note.dimensionId === columnId)
}

export function getKanbanColumnIdForNote(
  note: CycleNote,
  dimensions: ClassDimension[],
): string {
  const activeDimensionIds = new Set(dimensions.map((dimension) => dimension.id))

  if (note.dimensionId == null || !activeDimensionIds.has(note.dimensionId)) {
    return UNASSIGNED_COLUMN_ID
  }

  return note.dimensionId
}
