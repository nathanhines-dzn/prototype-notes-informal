import { useDraggable } from '@dnd-kit/core'
import { CSS } from '@dnd-kit/utilities'
import { useEffect, useRef, useState } from 'react'
import type { CycleNote } from '../../../types'
import { Trash } from '../../layout/icons'

type KanbanNoteCardProps = {
  note: CycleNote
  onUpdate: (patch: Partial<Pick<CycleNote, 'text' | 'dimensionId'>>) => void
  onDelete: () => void
}

export function KanbanNoteCard({ note, onUpdate, onDelete }: KanbanNoteCardProps) {
  const [editingText, setEditingText] = useState<string | null>(null)
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const isEditing = editingText != null

  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
    id: note.id,
    disabled: isEditing,
  })

  useEffect(() => {
    if (isEditing) {
      textareaRef.current?.focus()
      textareaRef.current?.select()
    }
  }, [isEditing])

  const style = transform
    ? { transform: CSS.Translate.toString(transform) }
    : undefined

  const handleBlur = () => {
    if (editingText == null) return

    const trimmed = editingText.trim()
    if (!trimmed) {
      setEditingText(null)
      return
    }
    if (trimmed !== note.text) {
      onUpdate({ text: trimmed })
    }
    setEditingText(null)
  }

  const handleKeyDown = (event: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key === 'Escape') {
      setEditingText(null)
    }
  }

  return (
    <article
      ref={setNodeRef}
      style={style}
      className={`group rounded-lg border border-gray-200 bg-white shadow-sm transition ${
        isDragging ? 'opacity-50' : 'hover:border-gray-300 hover:shadow'
      }`}
      {...(isEditing ? {} : { ...listeners, ...attributes })}
    >
      <div className="flex items-start justify-between gap-2 p-3">
        {isEditing ? (
          <textarea
            ref={textareaRef}
            value={editingText}
            onChange={(event) => setEditingText(event.target.value)}
            onBlur={handleBlur}
            onKeyDown={handleKeyDown}
            rows={3}
            className="min-h-16 w-full resize-y rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-teachstone-navy outline-none focus:ring-1 focus:ring-teachstone-teal"
          />
        ) : (
          <button
            type="button"
            onClick={() => setEditingText(note.text)}
            className="min-h-10 flex-1 cursor-text text-left text-sm leading-relaxed text-teachstone-navy"
          >
            {note.text}
          </button>
        )}
        <button
          type="button"
          onClick={onDelete}
          aria-label="Delete note"
          className="flex size-7 shrink-0 items-center justify-center rounded-md text-red-600 transition hover:bg-red-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-600"
        >
          <Trash className="size-3.5" />
        </button>
      </div>
    </article>
  )
}
