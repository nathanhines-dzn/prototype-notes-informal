import { useEffect, useState } from 'react'
import type { ClassDimension, CycleNote } from '../../types'
import { CycleNoteItem } from './CycleNoteItem'
import { DimensionSelect } from './DimensionSelect'

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
}

export function NotesSection({
  cycleNumber,
  notes,
  dimensions,
  onAddNote,
  onUpdateNote,
  onDeleteNote,
}: NotesSectionProps) {
  const [draftText, setDraftText] = useState('')
  const [selectedDimensionId, setSelectedDimensionId] = useState<string | null>(
    () => dimensions[0]?.id ?? null,
  )

  useEffect(() => {
    setSelectedDimensionId((current) => {
      if (current != null && dimensions.some((dimension) => dimension.id === current)) {
        return current
      }
      return dimensions[0]?.id ?? null
    })
  }, [dimensions])

  const canAdd = draftText.trim().length > 0

  const handleAddNote = () => {
    if (!canAdd) return
    onAddNote(draftText, selectedDimensionId)
    setDraftText('')
  }

  return (
    <div className="h-fit space-y-4">
      <div className="space-y-2">
        <div className="flex items-center justify-between gap-4">
          <label
            htmlFor={`notes-draft-${cycleNumber}`}
            className="text-base text-teachstone-navy"
          >
            Observation note
          </label>
          <DimensionSelect
            id={`notes-dimension-${cycleNumber}`}
            dimensions={dimensions}
            value={selectedDimensionId}
            onChange={setSelectedDimensionId}
          />
        </div>
        <textarea
          id={`notes-draft-${cycleNumber}`}
          value={draftText}
          onChange={(event) => setDraftText(event.target.value)}
          placeholder="Write what you observed."
          rows={4}
          className="min-h-24 w-full resize-y rounded-[11px] border-0 bg-[#f4f8fa] px-8 py-6 text-base text-teachstone-navy outline-none placeholder:text-gray-400 focus:ring-1 focus:ring-teachstone-teal"
        />
      </div>

      <div className="flex justify-end">
        <button
          type="button"
          onClick={handleAddNote}
          disabled={!canAdd}
          className="rounded-lg bg-teachstone-teal px-6 py-2 text-base text-white hover:bg-[#016688] disabled:cursor-not-allowed disabled:opacity-50"
        >
          Add note
        </button>
      </div>

      {notes.length > 0 && (
        <div className="space-y-3 border-t border-gray-100 pt-6">
          {notes.map((note) => (
            <CycleNoteItem
              key={note.id}
              note={note}
              dimensions={dimensions}
              onUpdate={(patch) => onUpdateNote(note.id, patch)}
              onDelete={() => onDeleteNote(note.id)}
            />
          ))}
        </div>
      )}
    </div>
  )
}
