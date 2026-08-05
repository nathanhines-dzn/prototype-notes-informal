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
    id: 'formal-notetaking-v1',
    label: 'Formal (Notetaking V1)',
    scoring: {
      type: 'numeric',
      overallLabel: 'Score',
      sectionLabel: 'Enter Scores',
      overallToggleLabel: 'Score',
    },
    features: {
      showIndicatorScoring: true,
      structuredNotes: true,
      notesLayout: 'dimension-textareas',
    },
    createForm: {
      title: 'Create CLASS 2nd Edition Observation',
      showEnvironmentCheckbox: true,
      showDimensionFocusOptions: false,
    },
    sidebar: {
      title: 'CLASS 2nd Edition with Environment',
      skipEnvironment: true,
    },
    steps: DEFAULT_STEPS,
  },
  {
    id: 'informal-notetaking-v1',
    label: 'Informal (Notetaking V1)',
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
      showDimensionFocusOptions: false,
    },
    sidebar: {
      title: 'CLASS 2nd Edition - Informal with Environment',
      skipEnvironment: true,
    },
    steps: DEFAULT_STEPS,
  },
  {
    id: 'formal-notetaking-v2',
    label: 'Formal (Notetaking V2)',
    scoring: {
      type: 'numeric',
      overallLabel: 'Score',
      sectionLabel: 'Enter Scores',
      overallToggleLabel: 'Score',
    },
    features: {
      showIndicatorScoring: true,
      structuredNotes: true,
      notesLayout: 'inline-bullet-rows',
    },
    createForm: {
      title: 'Create CLASS 2nd Edition Observation',
      showEnvironmentCheckbox: true,
      showDimensionFocusOptions: false,
    },
    sidebar: {
      title: 'CLASS 2nd Edition with Environment',
      skipEnvironment: true,
    },
    steps: DEFAULT_STEPS,
  },
  {
    id: 'formal-notetaking-v3',
    label: 'Formal (Notetaking V3)',
    scoring: {
      type: 'numeric',
      overallLabel: 'Score',
      sectionLabel: 'Enter Scores',
      overallToggleLabel: 'Score',
    },
    features: {
      showIndicatorScoring: true,
      structuredNotes: true,
      notesLayout: 'kanban',
    },
    createForm: {
      title: 'Create CLASS 2nd Edition Observation',
      showEnvironmentCheckbox: true,
      showDimensionFocusOptions: false,
    },
    sidebar: {
      title: 'CLASS 2nd Edition with Environment',
      skipEnvironment: true,
    },
    steps: DEFAULT_STEPS,
  },
]

/** Legacy `?flow=` values → current ids so old share links keep working. */
export const FLOW_ID_REDIRECTS: Record<string, string> = {
  'informal-2-notetaking-v1': 'formal-notetaking-v1',
  'informal-2-notetaking-v2-rows': 'formal-notetaking-v2',
  'informal-2-kanban-notes': 'formal-notetaking-v3',
}

export const DEFAULT_FLOW_ID = 'informal'

export function findFlowById(id: string): FlowDefinition | undefined {
  return FLOWS.find((entry) => entry.id === id)
}

export function resolveFlowId(id: string): string | null {
  const canonical = FLOW_ID_REDIRECTS[id] ?? id
  return findFlowById(canonical) ? canonical : null
}

export function isValidFlowId(id: string): boolean {
  return resolveFlowId(id) !== null
}

export function getFlowById(id: string): FlowDefinition {
  const resolved = resolveFlowId(id)
  if (!resolved) {
    throw new Error(`Unknown flow id: ${id}`)
  }
  return findFlowById(resolved)!
}
