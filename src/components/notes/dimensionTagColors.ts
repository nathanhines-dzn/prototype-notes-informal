export type DimensionTagColor = {
  bg: string
  text: string
  border: string
}

const UNASSIGNED_TAG_COLOR: DimensionTagColor = {
  bg: 'bg-gray-100',
  text: 'text-[#706f77]',
  border: 'border-gray-300',
}

/** Distinct chip colors per CLASS dimension for inline note tags. */
export const DIMENSION_TAG_COLORS: Record<string, DimensionTagColor> = {
  pc: { bg: 'bg-emerald-50', text: 'text-emerald-800', border: 'border-emerald-200' },
  nc: { bg: 'bg-rose-50', text: 'text-rose-800', border: 'border-rose-200' },
  eds: { bg: 'bg-sky-50', text: 'text-sky-800', border: 'border-sky-200' },
  rfcp: { bg: 'bg-teal-50', text: 'text-teal-800', border: 'border-teal-200' },
  bm: { bg: 'bg-amber-50', text: 'text-amber-900', border: 'border-amber-200' },
  p: { bg: 'bg-orange-50', text: 'text-orange-900', border: 'border-orange-200' },
  ilf: { bg: 'bg-lime-50', text: 'text-lime-900', border: 'border-lime-200' },
  cd: { bg: 'bg-indigo-50', text: 'text-indigo-800', border: 'border-indigo-200' },
  qof: { bg: 'bg-violet-50', text: 'text-violet-800', border: 'border-violet-200' },
  lm: { bg: 'bg-fuchsia-50', text: 'text-fuchsia-800', border: 'border-fuchsia-200' },
}

export function getDimensionTagColor(dimensionId: string | null): DimensionTagColor {
  if (dimensionId == null) {
    return UNASSIGNED_TAG_COLOR
  }
  return DIMENSION_TAG_COLORS[dimensionId] ?? UNASSIGNED_TAG_COLOR
}
