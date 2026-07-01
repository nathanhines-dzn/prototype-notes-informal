import { useEffect, useRef, useState } from 'react'
import { useToast } from '../../context/ToastContext'
import type { ClassDimension, CycleNote } from '../../types'
import { DimensionSelect } from './DimensionSelect'
import { GroupedNotesReview } from './GroupedNotesReview'
import { KeyboardShortcutHint } from './KeyboardShortcutHint'

type NotesSectionProps = {
  cycleNumber: number
  notes: CycleNote[]
  dimensions: ClassDimension[]
  onAddNote: (text: string, dimensionId: string | null) => void
  onUpdateNote: (
    noteId: string,
    patch: Partial<Pick<CycleNote, 'text' | 'dimensionId'>>,
  ) => void
  onDeleteNote: (noteId: string) => void
  onSyncDimensionNotes: (dimensionId: string, parsedTexts: string[]) => void
}

export function NotesSection({
  cycleNumber,
  notes,
  dimensions,
  onAddNote,
  onUpdateNote,
  onDeleteNote,
  onSyncDimensionNotes,
}: NotesSectionProps) {
  const { showToast } = useToast()
  const [draftText, setDraftText] = useState('')
  const [selectedDimensionId, setSelectedDimensionId] = useState<string | null>(null)
  const composerRef = useRef<HTMLDivElement>(null)
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  useEffect(() => {
    setSelectedDimensionId((current) => {
      if (current == null) return null
      if (dimensions.some((dimension) => dimension.id === current)) {
        return current
      }
      return null
    })
  }, [dimensions])

  const canAdd = draftText.trim().length > 0

  const handleAddNote = () => {
    if (!canAdd) return

    const dimension = dimensions.find((entry) => entry.id === selectedDimensionId)
    onAddNote(draftText, selectedDimensionId)
    showToast(dimension ? `Note added to ${dimension.abbr}` : 'Note saved')
    setDraftText('')
    textareaRef.current?.focus()
  }

  const handleDraftKeyDown = (event: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault()
      handleAddNote()
    }
  }

  return (
    <div className="h-fit space-y-4">
      <div ref={composerRef} className="space-y-3 rounded-[11px] bg-[#f4f8fa] px-6 py-5">
        <div className="flex flex-col space-y-2">
          <div className="mb-3 flex items-end justify-between gap-4">
            <label
              htmlFor={`notes-draft-${cycleNumber}`}
              className="h-full text-base font-semibold text-teachstone-navy"
            >
              New note
            </label>
            <DimensionSelect
              id={`notes-dimension-${cycleNumber}`}
              dimensions={dimensions}
              value={selectedDimensionId}
              onChange={setSelectedDimensionId}
            />
          </div>
          <textarea
            ref={textareaRef}
            id={`notes-draft-${cycleNumber}`}
            value={draftText}
            onChange={(event) => setDraftText(event.target.value)}
            onKeyDown={handleDraftKeyDown}
            placeholder="Write what you observed."
            rows={4}
            className="min-h-24 w-full resize-y rounded-[11px] border border-gray-300 bg-white px-6 py-4 text-base text-teachstone-navy outline-none placeholder:text-gray-400 focus:ring-1 focus:ring-teachstone-teal"
          />
        </div>

        <div className="flex justify-end">
          <div className="flex items-center gap-3">
            <KeyboardShortcutHint
              label="Keyboard shortcuts:"
              shortcuts={[
                { keys: ['Enter'], action: 'to add note' },
                { keys: ['Shift', 'Enter'], action: 'for new line' },
              ]}
            />
            <button
              type="button"
              onClick={handleAddNote}
              disabled={!canAdd}
              className="rounded-lg bg-teachstone-teal px-6 py-2 text-base text-white hover:bg-[#016688] disabled:cursor-not-allowed disabled:opacity-50"
            >
              Add note
            </button>
          </div>
        </div>
      </div>

      <GroupedNotesReview
        notes={notes}
        dimensions={dimensions}
        onSyncDimensionNotes={onSyncDimensionNotes}
        onUpdateNote={onUpdateNote}
        onDeleteNote={onDeleteNote}
      />
    </div>
  )
}
