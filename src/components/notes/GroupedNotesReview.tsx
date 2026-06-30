import type { ClassDimension, CycleNote } from '../../types'
import { groupDimensionsByDomain, partitionNotesByDimension } from '../../utils/groupDimensionsByDomain'
import { CycleNoteItem } from './CycleNoteItem'
import { DimensionNoteGroup } from './DimensionNoteGroup'

type GroupedNotesReviewProps = {
  notes: CycleNote[]
  dimensions: ClassDimension[]
  onSyncDimensionNotes: (dimensionId: string, parsedTexts: string[]) => void
  onUpdateNote: (
    noteId: string,
    patch: Partial<Pick<CycleNote, 'text' | 'dimensionId'>>,
  ) => void
  onDeleteNote: (noteId: string) => void
}

export function GroupedNotesReview({
  notes,
  dimensions,
  onSyncDimensionNotes,
  onUpdateNote,
  onDeleteNote,
}: GroupedNotesReviewProps) {
  const { untagged, byDimensionId } = partitionNotesByDimension(notes)
  const domainGroups = groupDimensionsByDomain(dimensions)

  if (notes.length === 0) {
    return null
  }

  return (
    <div className="space-y-6 border-t border-gray-100 pt-6">
      {untagged.length > 0 && (
        <section className="space-y-3">
          <div className="flex items-baseline justify-between gap-4">
            <h3 className="text-base font-semibold text-teachstone-navy">Needs dimension</h3>
            <span className="text-sm text-teachstone-muted">{untagged.length}</span>
          </div>
          <p className="text-sm text-teachstone-muted">
            Assign a dimension before scoring, or leave here until you are ready.
          </p>
          <div className="space-y-3">
            {untagged.map((note) => (
              <CycleNoteItem
                key={note.id}
                note={note}
                dimensions={dimensions}
                variant="unassigned"
                onUpdate={(patch) => onUpdateNote(note.id, patch)}
                onDelete={() => onDeleteNote(note.id)}
              />
            ))}
          </div>
        </section>
      )}

      <section className="space-y-4">
        <h3 className="text-base font-semibold text-teachstone-navy">Notes by dimension</h3>
        {domainGroups.map((domainGroup) => (
          <div key={domainGroup.domain} className="space-y-2">
            <h4 className="text-sm font-medium text-teachstone-muted">{domainGroup.domain}</h4>
            <div className="space-y-2">
              {domainGroup.dimensions.map((dimension) => (
                <DimensionNoteGroup
                  key={dimension.id}
                  dimension={dimension}
                  notes={byDimensionId.get(dimension.id) ?? []}
                  onSync={(parsedTexts) => onSyncDimensionNotes(dimension.id, parsedTexts)}
                />
              ))}
            </div>
          </div>
        ))}
      </section>
    </div>
  )
}
