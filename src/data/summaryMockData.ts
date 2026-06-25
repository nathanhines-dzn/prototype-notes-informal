import type { RangeValue } from '../types'

export type SummaryDomain = {
  name: string
  domainAverage?: string
  dimensions: {
    abbr: string
    value: string
  }[]
}

export type SummaryTableRow = {
  dimensionId: string
  abbr: string
  cycles: [string, string, string]
}

export type SummaryNoteEntry = {
  cycleNumber: number
  text: string
}

export type SummaryDimensionNotes = {
  dimensionId: string
  notes: SummaryNoteEntry[]
}

export type SummaryFeedbackCard = {
  title: string
  dimension: string
  indicator: string
  body: string
}

export type SummaryFeedbackByDimension = {
  dimension: string
  bullets: string[]
}

const FORMAL_ROLLUP: SummaryDomain[] = [
  {
    name: 'Emotional Support',
    domainAverage: '4.17',
    dimensions: [
      { abbr: 'PC', value: '4.33' },
      { abbr: 'NC', value: '2.67' },
      { abbr: 'EdS', value: '3.67' },
      { abbr: 'RCP', value: '3.33' },
    ],
  },
  {
    name: 'Classroom Organization',
    domainAverage: '4.11',
    dimensions: [
      { abbr: 'BM', value: '4.00' },
      { abbr: 'PR', value: '4.33' },
      { abbr: 'ILF', value: '4.00' },
    ],
  },
  {
    name: 'Instructional Support',
    domainAverage: '4.00',
    dimensions: [
      { abbr: 'CD', value: '4.00' },
      { abbr: 'QF', value: '4.00' },
      { abbr: 'LM', value: '4.00' },
    ],
  },
]

const INFORMAL_ROLLUP: SummaryDomain[] = [
  {
    name: 'Emotional Support',
    dimensions: [
      { abbr: 'PC', value: 'Mid' },
      { abbr: 'NC', value: 'Low' },
      { abbr: 'EdS', value: 'Mid' },
      { abbr: 'RCP', value: 'High' },
    ],
  },
  {
    name: 'Classroom Organization',
    dimensions: [
      { abbr: 'BM', value: 'High' },
      { abbr: 'PR', value: 'High' },
      { abbr: 'ILF', value: 'Mid' },
    ],
  },
  {
    name: 'Instructional Support',
    dimensions: [
      { abbr: 'CD', value: 'Mid' },
      { abbr: 'QF', value: 'Mid' },
      { abbr: 'LM', value: 'Low' },
    ],
  },
]

const FORMAL_TABLE: SummaryTableRow[] = [
  { dimensionId: 'pc', abbr: 'PC', cycles: ['4.33', '4.00', '4.67'] },
  { dimensionId: 'nc', abbr: 'NC', cycles: ['2.67', '3.00', '2.33'] },
  { dimensionId: 'eds', abbr: 'EdS', cycles: ['3.67', '3.33', '4.00'] },
  { dimensionId: 'rfcp', abbr: 'RCP', cycles: ['3.33', '3.67', '3.00'] },
  { dimensionId: 'bm', abbr: 'BM', cycles: ['4.00', '4.33', '3.67'] },
  { dimensionId: 'p', abbr: 'PR', cycles: ['4.33', '4.00', '4.67'] },
  { dimensionId: 'ilf', abbr: 'ILF', cycles: ['4.00', '3.67', '4.33'] },
  { dimensionId: 'cd', abbr: 'CD', cycles: ['4.00', '3.67', '4.33'] },
  { dimensionId: 'qof', abbr: 'QF', cycles: ['4.00', '4.33', '3.67'] },
  { dimensionId: 'lm', abbr: 'LM', cycles: ['4.00', '3.67', '4.33'] },
]

const INFORMAL_TABLE: SummaryTableRow[] = [
  { dimensionId: 'pc', abbr: 'PC', cycles: ['Mid', 'Mid', 'High'] },
  { dimensionId: 'nc', abbr: 'NC', cycles: ['Low', 'Low', 'Mid'] },
  { dimensionId: 'eds', abbr: 'EdS', cycles: ['Mid', 'Mid', 'Mid'] },
  { dimensionId: 'rfcp', abbr: 'RCP', cycles: ['High', 'Mid', 'High'] },
  { dimensionId: 'bm', abbr: 'BM', cycles: ['High', 'High', 'Mid'] },
  { dimensionId: 'p', abbr: 'PR', cycles: ['High', 'Mid', 'High'] },
  { dimensionId: 'ilf', abbr: 'ILF', cycles: ['Mid', 'Mid', 'High'] },
  { dimensionId: 'cd', abbr: 'CD', cycles: ['Mid', 'Low', 'Mid'] },
  { dimensionId: 'qof', abbr: 'QF', cycles: ['Mid', 'Mid', 'Mid'] },
  { dimensionId: 'lm', abbr: 'LM', cycles: ['Low', 'Mid', 'Low'] },
]

export const DIMENSION_NOTES: SummaryDimensionNotes[] = [
  {
    dimensionId: 'pc',
    notes: [
      {
        cycleNumber: 1,
        text: 'Educators greeted children warmly at arrival and used names consistently throughout the cycle.',
      },
      {
        cycleNumber: 2,
        text: 'Children appeared comfortable approaching educators during center time and shared materials willingly.',
      },
      {
        cycleNumber: 3,
        text: 'Positive tone maintained during transitions; educators acknowledged effort and cooperation.',
      },
    ],
  },
  {
    dimensionId: 'nc',
    notes: [
      {
        cycleNumber: 2,
        text: 'Brief moment of frustration when cleanup ran long; educator redirected calmly without raised voice.',
      },
    ],
  },
  { dimensionId: 'eds', notes: [] },
  {
    dimensionId: 'rfcp',
    notes: [
      {
        cycleNumber: 1,
        text: 'Children chose activity centers and educators followed their lead during small-group work.',
      },
      {
        cycleNumber: 3,
        text: 'Educator asked open-ended questions and waited for children to respond before offering help.',
      },
    ],
  },
  {
    dimensionId: 'bm',
    notes: [
      {
        cycleNumber: 1,
        text: 'Clear expectations posted; educator reminded children of routines before transitions.',
      },
      {
        cycleNumber: 2,
        text: 'Proactive cues used before challenging activity; minimal disruption observed.',
      },
      {
        cycleNumber: 3,
        text: 'Redirection was specific and immediate when one child left the group area.',
      },
    ],
  },
  { dimensionId: 'p', notes: [] },
  {
    dimensionId: 'ilf',
    notes: [
      {
        cycleNumber: 2,
        text: 'Educator varied materials and pacing during the read-aloud to maintain engagement.',
      },
    ],
  },
  { dimensionId: 'cd', notes: [] },
  {
    dimensionId: 'qof',
    notes: [
      {
        cycleNumber: 1,
        text: 'Educator expanded on a child’s answer with a follow-up question about why the character felt that way.',
      },
      {
        cycleNumber: 2,
        text: 'Specific praise given for persistence during a puzzle activity.',
      },
    ],
  },
  {
    dimensionId: 'lm',
    notes: [
      {
        cycleNumber: 3,
        text: 'Educator narrated actions during snack prep and introduced vocabulary for textures and colors.',
      },
    ],
  },
]

export const ENVIRONMENT_SCORE = {
  scoreLabel: '58 of 87',
}

export const FEEDBACK_CARDS: SummaryFeedbackCard[] = [
  {
    title: 'Strength Example',
    dimension: 'Negative Climate',
    indicator: 'Expressed negativity',
    body: 'There were no instances of negative climate observed during this observation. Educators maintained a calm, supportive tone even during transitions and cleanup.',
  },
  {
    title: 'Area of Growth Example',
    dimension: 'Behavior Management',
    indicator: 'Redirection of behavior',
    body: 'Consider providing more specific redirection when children leave activity areas. Naming the expected behavior and offering a clear alternative can reduce repeated reminders.',
  },
]

export const FEEDBACK_BY_DIMENSION: SummaryFeedbackByDimension[] = [
  {
    dimension: 'Positive Climate',
    bullets: [
      'Educators used a variety of strategies to create a warm, supportive environment.',
      'Children appeared comfortable and engaged with adults in the room.',
    ],
  },
  {
    dimension: 'Negative Climate',
    bullets: ['There were no instances of negative climate observed during this observation.'],
  },
  {
    dimension: 'Educator Sensitivity',
    bullets: [
      'Educators noticed when children needed assistance and responded promptly.',
      'Comfort was offered after minor conflicts between peers.',
    ],
  },
  {
    dimension: 'Regard for Child Perspectives',
    bullets: ['Children were given choices during center time and educators followed their interests.'],
  },
  {
    dimension: 'Behavior Management',
    bullets: [
      'Expectations were clear and consistently reinforced.',
      'Proactive strategies reduced the need for reactive correction.',
    ],
  },
  {
    dimension: 'Productivity',
    bullets: ['Routines moved smoothly with minimal downtime between activities.'],
  },
  {
    dimension: 'Instructional Learning Formats',
    bullets: ['Materials and groupings supported varied learning opportunities.'],
  },
  {
    dimension: 'Concept Development',
    bullets: ['Educators asked why and how questions during the read-aloud discussion.'],
  },
  {
    dimension: 'Quality of Feedback',
    bullets: ['Feedback was specific and encouraged children to extend their thinking.'],
  },
  {
    dimension: 'Language Modeling',
    bullets: ['Educators used rich vocabulary and repeated key terms in context.'],
  },
]

export function getRollupForScoringType(scoringType: 'numeric' | 'range'): SummaryDomain[] {
  return scoringType === 'numeric' ? FORMAL_ROLLUP : INFORMAL_ROLLUP
}

export function getTableForScoringType(scoringType: 'numeric' | 'range'): SummaryTableRow[] {
  return scoringType === 'numeric' ? FORMAL_TABLE : INFORMAL_TABLE
}

export function formatRangeLabel(value: RangeValue): string {
  if (value === 'low') return 'Low'
  if (value === 'mid') return 'Mid'
  return 'High'
}
