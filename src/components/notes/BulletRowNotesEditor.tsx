import {
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
  type ClipboardEvent,
  type FocusEvent,
  type KeyboardEvent,
  type MouseEvent,
} from 'react'
import type { ClassDimension, CycleNote } from '../../types'
import { notesToDisplayOrder } from '../../utils/dimensionBulletNotes'
import { DimensionNoteTag } from './DimensionNoteTag'

type BulletRowNotesEditorProps = {
  notes: CycleNote[]
  dimensions: ClassDimension[]
  onAddNote: (text: string, dimensionId: string | null) => string | null
  onUpdateNote: (
    noteId: string,
    patch: Partial<Pick<CycleNote, 'text' | 'dimensionId'>>,
  ) => void
  onDeleteNote: (noteId: string) => void
}

const DRAFT_KEY = '__draft__'

const TEXTAREA_CLASS =
  'min-h-7 max-w-full resize-none overflow-hidden bg-transparent py-1 text-base leading-5 text-teachstone-navy outline-none'

function splitPasteLines(raw: string): string[] {
  return raw
    .replace(/\r\n/g, '\n')
    .replace(/\r/g, '\n')
    .split('\n')
    .map((line) => line.replace(/^\s*[•\-*]\s*/, '').trim())
    .filter((line) => line.length > 0)
}

function placeCaretAtEnd(element: HTMLTextAreaElement | null, position?: number) {
  if (!element) return
  const pos = position ?? element.value.length
  element.focus()
  element.setSelectionRange(pos, pos)
}

/** Measure text width with the textarea's font so short notes can shrink-wrap. */
function measureTextWidth(textarea: HTMLTextAreaElement, text: string): number {
  const style = window.getComputedStyle(textarea)
  const canvas = measureTextWidth.canvas ?? document.createElement('canvas')
  measureTextWidth.canvas = canvas
  const context = canvas.getContext('2d')
  if (!context) return text.length * 8
  context.font = `${style.fontWeight} ${style.fontSize} ${style.fontFamily}`
  return context.measureText(text || ' ').width
}
measureTextWidth.canvas = null as HTMLCanvasElement | null

function syncTextareaLayout(
  textarea: HTMLTextAreaElement,
  options: { tagWidth: number; minWidth?: number } = { tagWidth: 0 },
) {
  const container = textarea.parentElement
  if (!container) return

  const available = container.clientWidth
  const gap = 8
  const isEmpty = !textarea.value
  const measureSource =
    isEmpty && textarea.placeholder ? textarea.placeholder : textarea.value || ' '
  const textWidth = Math.ceil(measureTextWidth(textarea, measureSource) + 8)
  const minWidth = options.minWidth ?? 48
  const tagWidth = options.tagWidth
  const neededWidth = Math.max(minWidth, textWidth)
  const fitsInline = neededWidth + tagWidth + gap <= available

  if (fitsInline) {
    textarea.style.width = `${neededWidth}px`
    textarea.style.flex = '0 0 auto'
    // Keep empty placeholder on one line when there's room
    if (isEmpty && textarea.placeholder) {
      textarea.style.height = '28px'
      return
    }
  } else {
    // Narrow viewport (or long note): fill the row; placeholder may wrap
    textarea.style.width = ''
    textarea.style.flex = '1 1 0%'
  }

  textarea.style.height = '0px'
  textarea.style.height = `${Math.max(textarea.scrollHeight, 28)}px`
}

export function BulletRowNotesEditor({
  notes,
  dimensions,
  onAddNote,
  onUpdateNote,
  onDeleteNote,
}: BulletRowNotesEditorProps) {
  const displayNotes = notesToDisplayOrder(notes)
  const [draftText, setDraftText] = useState('')
  const [dirtyTexts, setDirtyTexts] = useState<Record<string, string>>({})
  const inputRefs = useRef<Map<string, HTMLTextAreaElement>>(new Map())
  const shellRef = useRef<HTMLDivElement>(null)
  const draftTextRef = useRef(draftText)
  const onAddNoteRef = useRef(onAddNote)
  const pendingFocusRef = useRef<{ key: string; caret?: number } | null>({
    key: DRAFT_KEY,
  })

  draftTextRef.current = draftText
  onAddNoteRef.current = onAddNote

  const getNoteText = (note: CycleNote) => dirtyTexts[note.id] ?? note.text

  const commitDraft = () => {
    const trimmed = draftTextRef.current.trim()
    if (!trimmed) return false
    onAddNoteRef.current(trimmed, null)
    draftTextRef.current = ''
    setDraftText('')
    return true
  }

  // Accordion collapse unmounts this editor before blur can save — flush draft on unmount.
  useEffect(() => {
    return () => {
      const trimmed = draftTextRef.current.trim()
      if (!trimmed) return
      onAddNoteRef.current(trimmed, null)
      draftTextRef.current = ''
    }
  }, [])

  useLayoutEffect(() => {
    for (const [key, element] of inputRefs.current.entries()) {
      const tagWidth =
        key === DRAFT_KEY
          ? 0
          : (element.parentElement?.querySelector('[data-note-tag]')?.getBoundingClientRect()
              .width ?? 96)
      syncTextareaLayout(element, {
        tagWidth,
        minWidth: 48,
      })
    }
  }, [displayNotes, draftText, dirtyTexts, dimensions])

  const setInputRef = (key: string, element: HTMLTextAreaElement | null) => {
    if (element) {
      inputRefs.current.set(key, element)
      const tagWidth =
        key === DRAFT_KEY
          ? 0
          : (element.parentElement?.querySelector('[data-note-tag]')?.getBoundingClientRect()
              .width ?? 96)
      syncTextareaLayout(element, {
        tagWidth,
        minWidth: 48,
      })
    } else {
      inputRefs.current.delete(key)
    }
  }

  const focusRow = (key: string, caret?: number) => {
    pendingFocusRef.current = { key, caret }
    requestAnimationFrame(() => {
      const pending = pendingFocusRef.current
      if (!pending) return
      pendingFocusRef.current = null
      const element = inputRefs.current.get(pending.key) ?? null
      if (element) {
        const tagWidth =
          pending.key === DRAFT_KEY
            ? 0
            : (element.parentElement?.querySelector('[data-note-tag]')?.getBoundingClientRect()
                .width ?? 96)
        syncTextareaLayout(element, { tagWidth })
      }
      placeCaretAtEnd(element, pending.caret)
    })
  }

  const resizeFromEvent = (element: HTMLTextAreaElement, key: string) => {
    const tagWidth =
      key === DRAFT_KEY
        ? 0
        : (element.parentElement?.querySelector('[data-note-tag]')?.getBoundingClientRect().width ??
          96)
    syncTextareaLayout(element, {
      tagWidth,
      minWidth: 48,
    })
  }

  const handleDraftKeyDown = (event: KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key === 'Enter') {
      event.preventDefault()
      if (!commitDraft()) return
      focusRow(DRAFT_KEY)
      return
    }

    if (event.key !== 'Backspace') return
    if (event.currentTarget.selectionStart !== 0 || event.currentTarget.selectionEnd !== 0) {
      return
    }

    event.preventDefault()
    const previous = displayNotes.at(-1)
    if (!previous) return

    if (!draftText) {
      focusRow(previous.id, getNoteText(previous).length)
      return
    }

    const previousText = getNoteText(previous)
    const merged = `${previousText}${draftText}`
    setDirtyTexts((current) => ({ ...current, [previous.id]: merged }))
    onUpdateNote(previous.id, { text: merged.trim() || merged })
    draftTextRef.current = ''
    setDraftText('')
    focusRow(previous.id, previousText.length)
  }

  const handleNoteKeyDown = (
    event: KeyboardEvent<HTMLTextAreaElement>,
    note: CycleNote,
    index: number,
  ) => {
    const value = getNoteText(note)

    if (event.key === 'Enter') {
      event.preventDefault()
      const caret = event.currentTarget.selectionStart
      const before = value.slice(0, caret)
      const after = value.slice(caret)

      if (!before.trim()) return

      const nextText = before.trimEnd()
      setDirtyTexts((current) => ({ ...current, [note.id]: nextText }))
      if (nextText.trim() !== note.text) {
        onUpdateNote(note.id, { text: nextText.trim() })
      }

      const remainder = after.trimStart()
      if (remainder) {
        setDraftText((current) => (current ? `${remainder} ${current}` : remainder))
      }
      focusRow(DRAFT_KEY)
      return
    }

    if (event.key !== 'Backspace') return
    if (event.currentTarget.selectionStart !== 0 || event.currentTarget.selectionEnd !== 0) {
      return
    }

    event.preventDefault()
    if (index === 0) return

    const previous = displayNotes[index - 1]
    if (!previous) return

    const previousText = getNoteText(previous)
    const merged = `${previousText}${value}`
    setDirtyTexts((current) => {
      const next = { ...current, [previous.id]: merged }
      delete next[note.id]
      return next
    })
    onUpdateNote(previous.id, { text: merged.trim() || merged })
    onDeleteNote(note.id)
    focusRow(previous.id, previousText.length)
  }

  const handlePaste = (
    event: ClipboardEvent<HTMLTextAreaElement>,
    target: 'draft' | string,
  ) => {
    const raw = event.clipboardData.getData('text/plain')
    if (!raw.includes('\n') && !raw.includes('\r')) return

    event.preventDefault()
    const lines = splitPasteLines(raw)
    if (lines.length === 0) return

    if (target === 'draft') {
      const element = event.currentTarget
      const caret = element.selectionStart
      const before = draftText.slice(0, caret)
      const after = draftText.slice(element.selectionEnd)
      const [first, ...rest] = lines
      const firstCombined = `${before}${first ?? ''}`.trim()

      if (firstCombined) {
        onAddNote(firstCombined, null)
      }
      for (const line of rest) {
        onAddNote(line, null)
      }
      setDraftText(after.trim())
      focusRow(DRAFT_KEY)
      return
    }

    const noteId = target
    const note = displayNotes.find((entry) => entry.id === noteId)
    if (!note) return

    const element = event.currentTarget
    const value = getNoteText(note)
    const caret = element.selectionStart
    const before = value.slice(0, caret)
    const after = value.slice(element.selectionEnd)
    const [first, ...rest] = lines
    const firstCombined = `${before}${first ?? ''}`

    setDirtyTexts((current) => ({ ...current, [noteId]: firstCombined }))
    onUpdateNote(noteId, { text: firstCombined.trim() || firstCombined })

    for (const line of rest) {
      onAddNote(line, null)
    }
    if (after.trim()) {
      onAddNote(after.trim(), null)
    }
    focusRow(DRAFT_KEY)
  }

  const handleShellMouseDown = (event: MouseEvent<HTMLDivElement>) => {
    const target = event.target as HTMLElement
    // Let real editors / tag controls keep their own focus behavior.
    if (
      target.closest('textarea') ||
      target.closest('button') ||
      target.closest('[data-note-tag]') ||
      target.closest('[role="listbox"]')
    ) {
      return
    }

    event.preventDefault()

    const noteRow = target.closest<HTMLElement>('[data-note-row]')
    const noteId = noteRow?.dataset.noteRow
    if (noteId && noteId !== DRAFT_KEY) {
      focusRow(noteId)
      return
    }

    focusRow(DRAFT_KEY)
  }

  const handleShellFocusOut = (event: FocusEvent<HTMLDivElement>) => {
    const nextTarget = event.relatedTarget as Node | null
    if (nextTarget && shellRef.current?.contains(nextTarget)) {
      return
    }
    // Leaving the notes box commits any in-progress draft as a completed note.
    commitDraft()
  }

  const handleDraftBlur = () => {
    // Defer so focus can move; if the shell unmounted (accordion close), commit via cleanup.
    requestAnimationFrame(() => {
      if (shellRef.current?.contains(document.activeElement)) return
      commitDraft()
    })
  }

  return (
    <div className="space-y-2">
      <p className="text-sm text-teachstone-muted">
        One interaction per bullet. Press Enter to complete a note, then tag a dimension.
      </p>
      <div
        ref={shellRef}
        role="presentation"
        onMouseDown={handleShellMouseDown}
        onFocusOut={handleShellFocusOut}
        className="min-h-[11.25rem] cursor-text rounded-[11px] border border-gray-300 bg-white px-4 py-3 focus-within:ring-1 focus-within:ring-teachstone-teal"
      >
        <ul className="min-h-[9.75rem] space-y-2.5">
          {displayNotes.map((note, index) => (
            <li
              key={note.id}
              data-note-row={note.id}
              className="flex items-center gap-2"
            >
              <span className="shrink-0 text-base leading-5 text-teachstone-navy" aria-hidden>
                •
              </span>
              <div className="flex min-w-0 flex-1 flex-wrap items-center gap-x-2 gap-y-1">
                <textarea
                  ref={(element) => setInputRef(note.id, element)}
                  value={getNoteText(note)}
                  rows={1}
                  onChange={(event) => {
                    const next = event.target.value.replace(/\n/g, ' ')
                    setDirtyTexts((current) => ({ ...current, [note.id]: next }))
                    resizeFromEvent(event.target, note.id)
                  }}
                  onBlur={() => {
                    const next = getNoteText(note).trim()
                    if (next !== note.text) {
                      onUpdateNote(note.id, { text: next })
                    }
                    setDirtyTexts((current) => {
                      if (!(note.id in current)) return current
                      const nextDirty = { ...current }
                      delete nextDirty[note.id]
                      return nextDirty
                    })
                  }}
                  onKeyDown={(event) => handleNoteKeyDown(event, note, index)}
                  onPaste={(event) => handlePaste(event, note.id)}
                  className={TEXTAREA_CLASS}
                />
                <div data-note-tag className="shrink-0">
                  <DimensionNoteTag
                    id={`note-tag-${note.id}`}
                    dimensions={dimensions}
                    value={note.dimensionId}
                    onChange={(dimensionId) => onUpdateNote(note.id, { dimensionId })}
                  />
                </div>
              </div>
            </li>
          ))}

          <li data-note-row={DRAFT_KEY} className="flex items-center gap-2">
            <span className="shrink-0 text-base leading-5 text-teachstone-navy" aria-hidden>
              •
            </span>
            <div className="flex min-w-0 flex-1 flex-wrap items-center gap-x-2 gap-y-1">
              <textarea
                ref={(element) => setInputRef(DRAFT_KEY, element)}
                value={draftText}
                rows={1}
                placeholder={displayNotes.length === 0 ? 'Start typing an observation…' : undefined}
                onChange={(event) => {
                  setDraftText(event.target.value.replace(/\n/g, ' '))
                  resizeFromEvent(event.target, DRAFT_KEY)
                }}
                onBlur={handleDraftBlur}
                onKeyDown={handleDraftKeyDown}
                onPaste={(event) => handlePaste(event, 'draft')}
                className={`${TEXTAREA_CLASS} placeholder:text-gray-400`}
              />
            </div>
          </li>
        </ul>
      </div>
    </div>
  )
}
