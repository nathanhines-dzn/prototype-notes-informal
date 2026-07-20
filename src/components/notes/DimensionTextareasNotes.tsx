import { useEffect, useRef, useState } from 'react'
import type { ClassDimension, CycleNote } from '../../types'
import {
  notesToBulletText,
  parseBulletText,
} from '../../utils/dimensionBulletNotes'

type DimensionTextareasNotesProps = {
  notes: CycleNote[]
  dimensions: ClassDimension[]
  onSyncDimensionNotes: (dimensionId: string, parsedTexts: string[]) => void
}

const BULLET_PREFIX = '• '

function startsWithBullet(text: string): boolean {
  return /^\s*[•\-*]/.test(text)
}

function hasTrailingEmptyBullet(text: string): boolean {
  const trimmedEnd = text.replace(/\s+$/, '')
  if (!trimmedEnd) {
    return false
  }
  const lastLine = trimmedEnd.split('\n').at(-1) ?? ''
  return /^\s*[•\-*]\s*$/.test(lastLine)
}

type DimensionNotesFieldProps = {
  dimension: ClassDimension
  notes: CycleNote[]
  onSync: (parsedTexts: string[]) => void
}

function DimensionNotesField({ dimension, notes, onSync }: DimensionNotesFieldProps) {
  const [draftText, setDraftText] = useState(() => notesToBulletText(notes))
  const [isDirty, setIsDirty] = useState(false)
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  useEffect(() => {
    if (!isDirty) {
      setDraftText(notesToBulletText(notes))
    }
  }, [notes, isDirty])

  const placeCaretAt = (position: number) => {
    requestAnimationFrame(() => {
      const textarea = textareaRef.current
      if (textarea) {
        textarea.setSelectionRange(position, position)
      }
    })
  }

  const handleFocus = () => {
    if (!draftText.trim()) {
      setDraftText(BULLET_PREFIX)
      setIsDirty(true)
      placeCaretAt(BULLET_PREFIX.length)
      return
    }

    if (hasTrailingEmptyBullet(draftText)) {
      placeCaretAt(draftText.length)
      return
    }

    const nextText = `${draftText.trimEnd()}\n${BULLET_PREFIX}`
    setDraftText(nextText)
    setIsDirty(true)
    placeCaretAt(nextText.length)
  }

  const handleBlur = () => {
    const parsed = parseBulletText(draftText)
    onSync(parsed)
    setIsDirty(false)
  }

  const handleKeyDown = (event: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key === 'Enter' && event.shiftKey) {
      event.preventDefault()
      return
    }

    if (event.key !== 'Enter') {
      return
    }

    event.preventDefault()
    const textarea = event.currentTarget
    const start = textarea.selectionStart
    const end = textarea.selectionEnd
    const before = draftText.slice(0, start)
    const after = draftText.slice(end)
    const insert = `\n${BULLET_PREFIX}`
    const nextText = `${before}${insert}${after}`

    setDraftText(nextText)
    setIsDirty(true)
    placeCaretAt(start + insert.length)
  }

  const fieldId = `dimension-textarea-${dimension.id}`
  const label = `${dimension.name} (${dimension.abbr})`

  return (
    <div className="flex flex-col gap-2">
      <label
        htmlFor={fieldId}
        className="text-sm font-medium text-teachstone-navy"
      >
        {label}
      </label>
      <textarea
        ref={textareaRef}
        id={fieldId}
        value={draftText}
        onFocus={handleFocus}
        onChange={(event) => {
          let next = event.target.value
          if (!draftText.trim() && next.trim() && !startsWithBullet(next)) {
            next = `${BULLET_PREFIX}${next}`
          }
          setDraftText(next)
          setIsDirty(true)
        }}
        onBlur={handleBlur}
        onKeyDown={handleKeyDown}
        placeholder="Enter notes for this dimension."
        rows={3}
        className="min-h-[72px] w-full resize-y rounded-md border border-gray-200 bg-[#f3f4f6] px-3 py-2 text-sm leading-relaxed text-teachstone-navy outline-none placeholder:text-gray-400 focus:border-teachstone-teal focus:bg-white focus:ring-1 focus:ring-teachstone-teal"
      />
    </div>
  )
}

export function DimensionTextareasNotes({
  notes,
  dimensions,
  onSyncDimensionNotes,
}: DimensionTextareasNotesProps) {
  return (
    <div className="space-y-5">
      {dimensions.map((dimension) => {
        const dimensionNotes = notes.filter((note) => note.dimensionId === dimension.id)
        return (
          <DimensionNotesField
            key={dimension.id}
            dimension={dimension}
            notes={dimensionNotes}
            onSync={(parsedTexts) => onSyncDimensionNotes(dimension.id, parsedTexts)}
          />
        )
      })}
    </div>
  )
}
