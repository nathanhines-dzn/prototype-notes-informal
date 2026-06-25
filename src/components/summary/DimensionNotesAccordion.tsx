import type { SummaryNoteEntry } from '../../data/summaryMockData'

type DimensionNotesAccordionProps = {
  dimensionName: string
  notes: SummaryNoteEntry[]
  expanded: boolean
  onToggle: () => void
}

function noteCountLabel(count: number): string {
  return count === 1 ? '1 note' : `${count} notes`
}

export function DimensionNotesAccordion({
  dimensionName,
  notes,
  expanded,
  onToggle,
}: DimensionNotesAccordionProps) {
  const hasNotes = notes.length > 0
  const isDisabled = !hasNotes

  return (
    <div
      className={`rounded-xl bg-white shadow-[1px_1px_5.5px_#d7e6ed] ${isDisabled ? 'opacity-60' : ''}`}
    >
      <div className="p-3">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={onToggle}
            disabled={isDisabled}
            aria-expanded={hasNotes ? expanded : false}
            aria-disabled={isDisabled}
            aria-label={
              isDisabled
                ? `No notes for ${dimensionName}`
                : expanded
                  ? `Collapse notes for ${dimensionName}`
                  : `Expand notes for ${dimensionName}`
            }
            className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full text-xs font-bold text-white ${
              isDisabled
                ? 'cursor-not-allowed bg-gray-300'
                : 'bg-teachstone-teal hover:bg-[#016688]'
            }`}
          >
            {expanded ? '−' : '+'}
          </button>

          <div className="flex min-w-0 flex-1 items-center gap-3">
            <span className="text-base font-medium text-teachstone-navy">{dimensionName}</span>
            <span className="h-4 w-px shrink-0 bg-gray-300" aria-hidden="true" />
            <span className="text-sm text-teachstone-muted">{noteCountLabel(notes.length)}</span>
          </div>
        </div>

        {expanded && hasNotes && (
          <div className="mt-4 border-l-4 border-teachstone-teal pl-4">
            <div className="space-y-3">
              {notes.map((note) => (
                <article
                  key={`${note.cycleNumber}-${note.text.slice(0, 24)}`}
                  className="rounded-lg border border-gray-200 bg-white p-3"
                >
                  <span className="mb-3 inline-block rounded border border-gray-200 bg-[#f8f9fa] px-1.5 py-0.5 text-xs text-teachstone-muted">
                    Cycle {note.cycleNumber}
                  </span>
                  <p className="text-sm leading-relaxed text-gray-900">{note.text}</p>
                </article>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
