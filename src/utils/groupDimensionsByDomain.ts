import type { ClassDimension, CycleNote } from '../types'

export type DimensionDomainGroup = {
  domain: string
  dimensions: ClassDimension[]
}

export function groupDimensionsByDomain(dimensions: ClassDimension[]): DimensionDomainGroup[] {
  const groups: DimensionDomainGroup[] = []

  for (const dimension of dimensions) {
    const existing = groups.find((group) => group.domain === dimension.domain)
    if (existing) {
      existing.dimensions.push(dimension)
    } else {
      groups.push({ domain: dimension.domain, dimensions: [dimension] })
    }
  }

  return groups
}

export function partitionNotesByDimension(notes: CycleNote[]): {
  untagged: CycleNote[]
  byDimensionId: Map<string, CycleNote[]>
} {
  const untagged: CycleNote[] = []
  const byDimensionId = new Map<string, CycleNote[]>()

  for (const note of notes) {
    if (note.dimensionId == null) {
      untagged.push(note)
      continue
    }

    const dimensionNotes = byDimensionId.get(note.dimensionId) ?? []
    dimensionNotes.push(note)
    byDimensionId.set(note.dimensionId, dimensionNotes)
  }

  return { untagged, byDimensionId }
}
