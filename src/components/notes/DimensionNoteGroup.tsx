import { useEffect, useRef, useState } from 'react'
import type { ClassDimension, CycleNote } from '../../types'
import {
  appendBulletsToDraft,
  countBulletsInDraft,
  getAppendedNoteTexts,
  notesToBulletText,
  parseBulletText,
} from '../../utils/dimensionBulletNotes'
import { ChevronDown } from '../layout/icons'

type DimensionNoteGroupProps = {
  dimension: ClassDimension
  notes: CycleNote[]
  onSync: (parsedTexts: string[]) => void
}

export function DimensionNoteGroup({ dimension, notes, onSync }: DimensionNoteGroupProps) {
  const [expanded, setExpanded] = useState(notes.length > 0)
  const [draftText, setDraftText] = useState(() => notesToBulletText(notes))
  const [isDirty, setIsDirty] = useState(false)
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const knownTextsRef = useRef(parseBulletText(notesToBulletText(notes)))

  useEffect(() => {
    if (notes.length > 0) {
      setExpanded(true)
    }
  }, [notes.length])

  useEffect(() => {
    const nextTexts = parseBulletText(notesToBulletText(notes))

    if (!isDirty) {
      setDraftText(notesToBulletText(notes))
      knownTextsRef.current = nextTexts
      return
    }

    const appended = getAppendedNoteTexts(knownTextsRef.current, nextTexts)
    if (appended.length > 0) {
      setDraftText((current) => appendBulletsToDraft(current, appended))
      knownTextsRef.current = nextTexts
    }
  }, [notes, isDirty])

  const displayCount = isDirty ? countBulletsInDraft(draftText) : notes.length

  const handleBlur = () => {
    const parsed = parseBulletText(draftText)
    onSync(parsed)
    setIsDirty(false)
    knownTextsRef.current = parsed
  }

  const handleAddNote = () => {
    setExpanded(true)
    requestAnimationFrame(() => {
      textareaRef.current?.focus()
      setDraftText((current) => {
        const trimmed = current.trimEnd()
        if (!trimmed) {
          return '• '
        }
        return `${trimmed}\n• `
      })
      setIsDirty(true)
    })
  }

  const handleKeyDown = (event: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key !== 'Enter' || event.shiftKey) {
      return
    }

    event.preventDefault()
    const textarea = event.currentTarget
    const start = textarea.selectionStart
    const end = textarea.selectionEnd
    const before = draftText.slice(0, start)
    const after = draftText.slice(end)
    const insert = '\n• '
    const nextText = `${before}${insert}${after}`

    setDraftText(nextText)
    setIsDirty(true)

    requestAnimationFrame(() => {
      const cursor = start + insert.length
      textarea.setSelectionRange(cursor, cursor)
    })
  }

  return (
    <div className="rounded-lg border border-gray-100 bg-[#fafbfc]">
      <div className="flex items-center justify-between gap-3 px-4 py-3">
        <button
          type="button"
          onClick={() => setExpanded((current) => !current)}
          aria-expanded={expanded}
          className="flex min-w-0 flex-1 items-center gap-2 text-left"
        >
          <ChevronDown
            className={`size-4 shrink-0 text-teachstone-muted transition ${expanded ? '' : '-rotate-90'}`}
          />
          <span className="truncate text-sm font-semibold text-teachstone-navy">
            {dimension.name}
          </span>
          <span className="shrink-0 text-sm text-teachstone-muted">({displayCount})</span>
        </button>
        <button
          type="button"
          onClick={handleAddNote}
          className="shrink-0 rounded-lg px-2 py-1 text-sm font-medium text-teachstone-teal hover:bg-teachstone-teal/5"
        >
          Add note
        </button>
      </div>

      {expanded && (
        <div className="space-y-2 border-t border-gray-100 px-4 py-3">
          <textarea
            ref={textareaRef}
            id={`dimension-notes-${dimension.id}`}
            value={draftText}
            onChange={(event) => {
              setDraftText(event.target.value)
              setIsDirty(true)
            }}
            onBlur={handleBlur}
            onKeyDown={handleKeyDown}
            placeholder="• Write what you observed."
            rows={3}
            className="min-h-20 w-full resize-y rounded-lg border border-gray-200 bg-white px-4 py-3 text-sm leading-relaxed text-teachstone-navy outline-none placeholder:text-gray-400 focus:ring-1 focus:ring-teachstone-teal"
          />
          <p className="text-xs text-teachstone-muted">
            <span className="font-medium text-teachstone-navy/70">Enter</span> starts a new bullet.{' '}
            <span className="font-medium text-teachstone-navy/70">Shift+Enter</span> continues a
            line.
          </p>
        </div>
      )}
    </div>
  )
}
