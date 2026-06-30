import type { CycleSectionId, FlowDefinition } from '../types'

export function getDefaultExpandedCycleSection(flow: FlowDefinition): CycleSectionId | null {
  if (flow.features?.structuredNotes) {
    return 'notes'
  }
  return 'enter-scoring'
}
