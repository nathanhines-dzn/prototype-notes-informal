import type { FlowDefinition } from '../types'

const DEFAULT_STEPS: FlowDefinition['steps'] = [
  { type: 'create' },
  { type: 'cycle', cycleNumber: 1 },
  { type: 'summary' },
  { type: 'complete' },
]

export const FLOWS: FlowDefinition[] = [
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
    id: 'informal-2',
    label: 'Informal 2.0 (dimension focus)',
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
      showDimensionFocusOptions: true,
    },
    sidebar: {
      title: 'CLASS 2nd Edition - Informal with Environment',
      skipEnvironment: true,
    },
    steps: DEFAULT_STEPS,
  },
  {
    id: 'informal-2-new-notes',
    label: 'Informal 2.0 (New Notes)',
    scoring: {
      type: 'range',
      overallLabel: 'Overall Range',
      sectionLabel: 'Enter Ranges',
      overallToggleLabel: 'Range',
    },
    features: {
      showIndicatorScoring: true,
      structuredNotes: true,
    },
    createForm: {
      title: 'Create CLASS 2nd Edition - Informal Observation',
      showEnvironmentCheckbox: true,
      showDimensionFocusOptions: true,
    },
    sidebar: {
      title: 'CLASS 2nd Edition - Informal with Environment',
      skipEnvironment: true,
    },
    steps: DEFAULT_STEPS,
  },
  {
    id: 'informal-2-kanban-notes',
    label: 'Informal 2.0 (Kanban Notes)',
    scoring: {
      type: 'range',
      overallLabel: 'Overall Range',
      sectionLabel: 'Enter Ranges',
      overallToggleLabel: 'Range',
    },
    features: {
      showIndicatorScoring: true,
      structuredNotes: true,
      notesLayout: 'kanban',
    },
    createForm: {
      title: 'Create CLASS 2nd Edition - Informal Observation',
      showEnvironmentCheckbox: true,
      showDimensionFocusOptions: true,
    },
    sidebar: {
      title: 'CLASS 2nd Edition - Informal with Environment',
      skipEnvironment: true,
    },
    steps: DEFAULT_STEPS,
  },
  {
    id: 'informal-2-notetaking-v1',
    label: 'Informal 2.0 (Notetaking V1)',
    scoring: {
      type: 'range',
      overallLabel: 'Overall Range',
      sectionLabel: 'Enter Ranges',
      overallToggleLabel: 'Range',
    },
    features: {
      showIndicatorScoring: true,
      structuredNotes: true,
      notesLayout: 'dimension-textareas',
    },
    createForm: {
      title: 'Create CLASS 2nd Edition - Informal Observation',
      showEnvironmentCheckbox: true,
      showDimensionFocusOptions: true,
    },
    sidebar: {
      title: 'CLASS 2nd Edition - Informal with Environment',
      skipEnvironment: true,
    },
    steps: DEFAULT_STEPS,
  },
  {
    id: 'informal-2-notetaking-v2-rows',
    label: 'Informal 2.0 (Notetaking V2)',
    scoring: {
      type: 'range',
      overallLabel: 'Overall Range',
      sectionLabel: 'Enter Ranges',
      overallToggleLabel: 'Range',
    },
    features: {
      showIndicatorScoring: true,
      structuredNotes: true,
      notesLayout: 'inline-bullet-rows',
    },
    createForm: {
      title: 'Create CLASS 2nd Edition - Informal Observation',
      showEnvironmentCheckbox: true,
      showDimensionFocusOptions: true,
    },
    sidebar: {
      title: 'CLASS 2nd Edition - Informal with Environment',
      skipEnvironment: true,
    },
    steps: DEFAULT_STEPS,
  },
]

export const DEFAULT_FLOW_ID = 'informal'

export function findFlowById(id: string): FlowDefinition | undefined {
  return FLOWS.find((entry) => entry.id === id)
}

export function isValidFlowId(id: string): boolean {
  return findFlowById(id) !== undefined
}

export function getFlowById(id: string): FlowDefinition {
  const flow = findFlowById(id)
  if (!flow) {
    throw new Error(`Unknown flow id: ${id}`)
  }
  return flow
}
