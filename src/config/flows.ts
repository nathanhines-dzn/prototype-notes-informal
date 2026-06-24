import type { FlowDefinition } from '../types'

const DEFAULT_STEPS: FlowDefinition['steps'] = [
  { type: 'create' },
  { type: 'cycle', cycleNumber: 1 },
  { type: 'cycle', cycleNumber: 2 },
  { type: 'cycle', cycleNumber: 3 },
  { type: 'complete' },
]

export const FLOWS: FlowDefinition[] = [
  {
    id: 'informal',
    label: 'Informal observation (ranges)',
    scoring: {
      type: 'range',
      overallLabel: 'Overall Range',
      sectionLabel: 'Enter Ranges',
      overallToggleLabel: 'Range',
    },
    features: {
      showIndicatorScoring: true,
    },
    createForm: {
      title: 'Create CLASS 2nd Edition - Informal Observation',
      showEnvironmentCheckbox: true,
    },
    sidebar: {
      title: 'CLASS 2nd Edition - Informal with Environment',
      skipEnvironment: true,
    },
    steps: DEFAULT_STEPS,
  },
  {
    id: 'formal',
    label: 'Formal observation (scores)',
    scoring: {
      type: 'numeric',
      overallLabel: 'Score',
      sectionLabel: 'Enter Scores',
      overallToggleLabel: 'Score',
    },
    features: {
      showIndicatorScoring: true,
    },
    createForm: {
      title: 'Create CLASS 2nd Edition Observation',
      showEnvironmentCheckbox: true,
    },
    sidebar: {
      title: 'CLASS 2nd Edition with Environment',
      skipEnvironment: true,
    },
    steps: DEFAULT_STEPS,
  },
]

export const DEFAULT_FLOW_ID = 'informal'

export function getFlowById(id: string): FlowDefinition {
  const flow = FLOWS.find((entry) => entry.id === id)
  if (!flow) {
    throw new Error(`Unknown flow id: ${id}`)
  }
  return flow
}
