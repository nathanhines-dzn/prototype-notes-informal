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
  const domainGroupsWithNotes = groupDimensionsByDomain(dimensions)
    .map((domainGroup) => ({
      ...domainGroup,
      dimensions: domainGroup.dimensions.filter(
        (dimension) => (byDimensionId.get(dimension.id) ?? []).length > 0,
      ),
    }))
    .filter((domainGroup) => domainGroup.dimensions.length > 0)

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

      {domainGroupsWithNotes.length > 0 && (
        <section className="space-y-4">
          <h3 className="text-base font-semibold text-teachstone-navy">Notes by dimension</h3>
          {domainGroupsWithNotes.map((domainGroup) => (
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
      )}
    </div>
  )
}
