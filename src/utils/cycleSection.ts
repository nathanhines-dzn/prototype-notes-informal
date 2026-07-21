import type { CycleSectionId, FlowDefinition } from '../types'

/** Cycle section accordions start collapsed on all flows. */
export function getDefaultExpandedCycleSection(_flow: FlowDefinition): CycleSectionId | null {
  return null
}
