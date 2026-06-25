import type { ClassDimension } from '../types'

export const CLASS_DIMENSIONS: ClassDimension[] = [
  {
    id: 'pc',
    name: 'Positive Climate',
    abbr: 'PC',
    domain: 'Emotional Support',
    indicators: [
      { id: 'pc-relationships', name: 'Relationships' },
      { id: 'pc-enjoyment', name: 'Enjoyment' },
      { id: 'pc-positive-communication', name: 'Positive Communication' },
      { id: 'pc-respect', name: 'Respect' },
    ],
  },
  {
    id: 'nc',
    name: 'Negative Climate',
    abbr: 'NC',
    domain: 'Emotional Support',
    indicators: [
      { id: 'nc-expressed-negativity', name: 'Expressed negativity' },
      { id: 'nc-punitive-control', name: 'Punitive control' },
      { id: 'nc-disrespect', name: 'Disrespect' },
      {
        id: 'nc-severe-negativity',
        name: 'Severe negativity',
        levels: ['low', 'high'],
      },
    ],
  },
  {
    id: 'eds',
    name: 'Educator Sensitivity',
    abbr: 'EdS',
    domain: 'Emotional Support',
    indicators: [
      { id: 'eds-awareness', name: 'Awareness' },
      { id: 'eds-responsiveness', name: 'Responsiveness' },
      { id: 'eds-problem-resolution', name: 'Problem Resolution' },
      { id: 'eds-child-comfort', name: 'Child Comfort' },
    ],
  },
  {
    id: 'rfcp',
    name: 'Regard for Child Perspectives',
    abbr: 'RCP',
    domain: 'Emotional Support',
    indicators: [
      { id: 'rfcp-child-centered', name: 'Child-Centered' },
      { id: 'rfcp-autonomy-leadership', name: 'Support for Autonomy and Leadership' },
      { id: 'rfcp-child-expression', name: 'Child Expression' },
      { id: 'rfcp-allows-movement', name: 'Allows Movement' },
    ],
  },
  {
    id: 'bm',
    name: 'Behavior Management',
    abbr: 'BM',
    domain: 'Classroom Organization',
    indicators: [
      { id: 'bm-behavior-expectations', name: 'Behavior Expectations' },
      { id: 'bm-proactive', name: 'Proactive' },
      { id: 'bm-redirection', name: 'Redirection of Behavior' },
      { id: 'bm-child-behavior', name: 'Child Behavior' },
    ],
  },
  {
    id: 'p',
    name: 'Productivity',
    abbr: 'PR',
    domain: 'Classroom Organization',
    indicators: [
      { id: 'p-opportunities', name: 'Opportunities for Learning' },
      { id: 'p-routines', name: 'Routines' },
      { id: 'p-transitions', name: 'Transitions' },
      { id: 'p-preparation', name: 'Preparation' },
    ],
  },
  {
    id: 'ilf',
    name: 'Instructional Learning Formats',
    abbr: 'ILF',
    domain: 'Classroom Organization',
    indicators: [
      { id: 'ilf-facilitation', name: 'Effective facilitation' },
      { id: 'ilf-variation', name: 'Variation in approach' },
      { id: 'ilf-child-interest', name: 'Child interest' },
      { id: 'ilf-clarity', name: 'Clarity of learning objectives' },
    ],
  },
  {
    id: 'cd',
    name: 'Concept Development',
    abbr: 'CD',
    domain: 'Instructional Support',
    indicators: [
      { id: 'cd-analysis', name: 'Analysis and Reasoning' },
      { id: 'cd-creativity', name: 'Creativity' },
      { id: 'cd-integration', name: 'Integration' },
      { id: 'cd-connections', name: 'Connections to Everyday Lives' },
    ],
  },
  {
    id: 'qof',
    name: 'Quality of Feedback',
    abbr: 'QF',
    domain: 'Instructional Support',
    indicators: [
      { id: 'qof-scaffolding', name: 'Scaffolding' },
      { id: 'qof-feedback-loops', name: 'Feedback loops' },
      { id: 'qof-prompting-thought', name: 'Prompting thought processes' },
      { id: 'qof-providing-information', name: 'Providing information' },
      { id: 'qof-encouragement', name: 'Encouragement and Affirmation' },
    ],
  },
  {
    id: 'lm',
    name: 'Language Modeling',
    abbr: 'LM',
    domain: 'Instructional Support',
    indicators: [
      { id: 'lm-conversation', name: 'Frequent conversations' },
      { id: 'lm-open-ended-questions', name: 'Open-ended questions' },
      { id: 'lm-extensions', name: 'Communication extensions' },
      { id: 'lm-narration', name: 'Narration' },
      { id: 'lm-advanced', name: 'Advanced language' },
    ],
  },
]

export function createEmptyDimensionData(dimensionId: string): import('../types').DimensionCycleData {
  const dimension = CLASS_DIMENSIONS.find((d) => d.id === dimensionId)
  const indicatorValues: Record<string, null> = {}
  dimension?.indicators.forEach((indicator) => {
    indicatorValues[indicator.id] = null
  })

  return {
    notes: '',
    indicatorValues,
    overallValue: null,
  }
}

export function createEmptyCycleData(): import('../types').CycleData {
  return Object.fromEntries(
    CLASS_DIMENSIONS.map((dimension) => [dimension.id, createEmptyDimensionData(dimension.id)]),
  )
}

export function createEmptyAllCycleData(cycleCount: number): import('../types').AllCycleData {
  return Object.fromEntries(
    Array.from({ length: cycleCount }, (_, index) => [index + 1, createEmptyCycleData()]),
  )
}
