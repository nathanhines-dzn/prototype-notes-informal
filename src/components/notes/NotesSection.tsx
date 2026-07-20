import { useEffect, useRef, useState } from 'react'
import { useToast } from '../../context/ToastContext'
import type { ClassDimension, CycleNote } from '../../types'
import { DimensionSelect } from './DimensionSelect'
import { DimensionTextareasNotes } from './DimensionTextareasNotes'
import { GroupedNotesReview } from './GroupedNotesReview'
import { KanbanNotesBoard } from './kanban/KanbanNotesBoard'
import { KeyboardShortcutHint } from './KeyboardShortcutHint'

type NotesSectionProps = {
  cycleNumber: number
  notes: CycleNote[]
  dimensions: ClassDimension[]
  notesLayout?: 'grouped' | 'kanban' | 'dimension-textareas'
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
  notesLayout = 'grouped',
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

  if (notesLayout === 'dimension-textareas') {
    return (
      <DimensionTextareasNotes
        notes={notes}
        dimensions={dimensions}
        onSyncDimensionNotes={onSyncDimensionNotes}
      />
    )
  }

  const canAdd = draftText.trim().length > 0

  const handleAddNote = () => {
    if (!canAdd) return

    const dimension = dimensions.find((entry) => entry.id === selectedDimensionId)
    onAddNote(draftText, selectedDimensionId)
    showToast(dimension ? `Note added to ${dimension.name}` : 'Note saved')
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
      <div ref={composerRef} className="mb-5 space-y-3 rounded-[11px] border border-gray-200 bg-[#f4f8fa] px-6 py-5">
        <div className="flex flex-col space-y-2">
          <div className="mb-3 flex items-end justify-between gap-4">
            <div className="min-w-0">
              <label
                htmlFor={`notes-draft-${cycleNumber}`}
                className="h-full text-base font-semibold text-teachstone-navy"
              >
                Add new note
              </label>
              <p
                id={`notes-draft-helper-${cycleNumber}`}
                className="mt-0 text-sm text-teachstone-muted"
              >
                One interaction per note. Tag a dimension now or later.
              </p>
            </div>
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
            placeholder="e.g., Teacher knelt to eye level when child became frustrated."
            rows={4}
            aria-describedby={`notes-draft-helper-${cycleNumber}`}
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

      {notesLayout === 'kanban' ? (
        <KanbanNotesBoard
          notes={notes}
          dimensions={dimensions}
          onUpdateNote={onUpdateNote}
          onDeleteNote={onDeleteNote}
        />
      ) : (
        <GroupedNotesReview
          notes={notes}
          dimensions={dimensions}
          onSyncDimensionNotes={onSyncDimensionNotes}
          onUpdateNote={onUpdateNote}
          onDeleteNote={onDeleteNote}
        />
      )}
    </div>
  )
}
