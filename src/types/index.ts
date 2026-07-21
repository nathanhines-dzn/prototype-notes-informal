export type RangeValue = 'low' | 'mid' | 'high'
export type NumericScore = 1 | 2 | 3 | 4 | 5 | 6 | 7
export type ScoreValue = RangeValue | NumericScore

export type FlowStep =
  | { type: 'create' }
  | { type: 'cycle'; cycleNumber: number }
  | { type: 'summary' }
  | { type: 'complete' }

export type FlowDefinition = {
  id: string
  label: string
  scoring: {
    /** Applies to the dimension overall row only; indicators always use Low/Mid/High ranges. */
    type: 'range' | 'numeric'
    overallLabel: string
    sectionLabel: string
    overallToggleLabel: string
  }
  features?: {
    showIndicatorScoring?: boolean
    structuredNotes?: boolean
    notesLayout?:
      | 'grouped'
      | 'kanban'
      | 'dimension-textareas'
      | 'inline-bullet-rows'
  }
  createForm: {
    title: string
    showEnvironmentCheckbox?: boolean
    showDimensionFocusOptions?: boolean
  }
  sidebar: {
    title: string
    skipEnvironment?: boolean
  }
  steps: FlowStep[]
}

export type CycleNote = {
  id: string
  text: string
  dimensionId: string | null
}

export type CycleSectionId = 'cycle-details' | 'notes' | 'enter-scoring'

export type CycleNotesData = Record<number, CycleNote[]>

export type DimensionCycleData = {
  notes: string
  indicatorValues: Record<string, RangeValue | null>
  overallValue: ScoreValue | null
}

export type CycleData = Record<string, DimensionCycleData>
export type AllCycleData = Record<number, CycleData>

export type ObservationMeta = {
  date: string
  center: string
  classroom: string
  tool: string
  numberOfCycles: number
}

export type ClassIndicator = {
  id: string
  name: string
  levels?: RangeValue[]
}

export type ClassDimension = {
  id: string
  name: string
  abbr: string
  domain: string
  indicators: ClassIndicator[]
}
