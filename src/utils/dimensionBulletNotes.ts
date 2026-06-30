import type { CycleNote } from '../types'

const BULLET_PREFIX = '• '

/** Flatten internal newlines so each note is one bullet line. */
export function normalizeNoteText(text: string): string {
  return text.replace(/\r\n/g, '\n').replace(/\n+/g, ' ').trim()
}

/** Notes are stored newest-first; bullets display oldest-first. */
export function notesToDisplayOrder(notes: CycleNote[]): CycleNote[] {
  return [...notes].reverse()
}

export function notesToBulletText(notes: CycleNote[]): string {
  return notesToDisplayOrder(notes)
    .map((note) => `${BULLET_PREFIX}${normalizeNoteText(note.text)}`)
    .join('\n')
}

/**
 * Parse bullet textarea into note texts (oldest-first).
 * Lines starting with •, -, or * begin a new note; other lines continue the previous note.
 */
export function parseBulletText(text: string): string[] {
  const lines = text.split('\n')
  const bullets: string[] = []
  let current = ''

  for (const line of lines) {
    const bulletMatch = line.match(/^\s*[•\-*]\s*(.*)$/)
    if (bulletMatch) {
      if (current.trim()) {
        bullets.push(normalizeNoteText(current))
      }
      current = bulletMatch[1] ?? ''
      continue
    }

    const trimmed = line.trim()
    if (trimmed === '' && !current.trim()) {
      continue
    }

    if (current.trim()) {
      current = `${current} ${trimmed}`.trim()
    } else if (trimmed) {
      current = trimmed
    }
  }

  if (current.trim()) {
    bullets.push(normalizeNoteText(current))
  }

  return bullets.filter((entry) => entry.length > 0)
}

/** Rebuild dimension notes from parsed bullets, reusing IDs by position (index-based sync). */
export function rebuildDimensionNotes(
  existing: CycleNote[],
  parsedTexts: string[],
  dimensionId: string,
): CycleNote[] {
  const orderedExisting = notesToDisplayOrder(existing)

  const chronological = parsedTexts.map((text, index) => ({
    id: orderedExisting[index]?.id ?? crypto.randomUUID(),
    text: normalizeNoteText(text),
    dimensionId,
  }))

  return chronological.reverse()
}

/** Bullet lines appended by composer since last draft (oldest-first texts). */
export function getAppendedNoteTexts(
  previousTexts: string[],
  nextTexts: string[],
): string[] {
  if (nextTexts.length <= previousTexts.length) {
    return []
  }
  return nextTexts.slice(previousTexts.length)
}

export function appendBulletsToDraft(draftText: string, newTexts: string[]): string {
  if (newTexts.length === 0) {
    return draftText
  }

  const suffix = newTexts.map((text) => `${BULLET_PREFIX}${text}`).join('\n')
  const trimmedDraft = draftText.trimEnd()

  if (!trimmedDraft) {
    return suffix
  }

  return `${trimmedDraft}\n${suffix}`
}

export function countBulletsInDraft(draftText: string): number {
  return parseBulletText(draftText).length
}
