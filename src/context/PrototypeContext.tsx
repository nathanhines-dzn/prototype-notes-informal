import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react'
import { getFlowById } from '../config/flows'
import {
  CLASS_DIMENSIONS,
  createEmptyAllCycleData,
  createEmptyCycleNotes,
  createEmptyDimensionData,
} from '../data/classDimensions'
import type {
  AllCycleData,
  ClassDimension,
  CycleNote,
  CycleNotesData,
  CycleSectionId,
  DimensionCycleData,
  FlowDefinition,
  FlowStep,
  ObservationMeta,
} from '../types'
import { getDefaultExpandedCycleSection } from '../utils/cycleSection'
import {
  FLOW_STORAGE_KEY,
  getFlowIdFromUrl,
  resolveInitialFlowId,
  setFlowInUrl,
  stripInvalidFlowParam,
} from '../utils/flowUrl'

const ALL_DIMENSION_IDS = CLASS_DIMENSIONS.map((dimension) => dimension.id)

type PrototypeContextValue = {
  activeFlow: FlowDefinition
  activeFlowId: string
  stepIndex: number
  currentStep: FlowStep
  observationMeta: ObservationMeta
  cycleData: AllCycleData
  cycleNotes: CycleNotesData
  settingsOpen: boolean
  expandedDimensionId: string | null
  expandedCycleSection: CycleSectionId | null
  includeAllDimensions: boolean
  focusedDimensionIds: string[]
  setSettingsOpen: (open: boolean) => void
  setActiveFlow: (flowId: string) => void
  selectAllDimensions: () => void
  setAllDimensionsRowChecked: (checked: boolean) => void
  toggleDimensionInSelection: (dimensionId: string) => void
  removeDimensionFromSelection: (dimensionId: string) => void
  getActiveDimensions: () => ClassDimension[]
  goNext: () => void
  goToSummary: () => void
  goToComplete: () => void
  goBack: () => void
  restart: () => void
  setExpandedDimensionId: (dimensionId: string | null) => void
  toggleCycleSection: (sectionId: CycleSectionId) => void
  addCycleNote: (cycleNumber: number, text: string, dimensionId?: string | null) => void
  updateCycleNote: (
    cycleNumber: number,
    noteId: string,
    patch: Partial<Pick<CycleNote, 'text' | 'dimensionId'>>,
  ) => void
  deleteCycleNote: (cycleNumber: number, noteId: string) => void
  getNotesForDimension: (cycleNumber: number, dimensionId: string) => CycleNote[]
  getUntaggedNotes: (cycleNumber: number) => CycleNote[]
  updateDimensionData: (
    cycleNumber: number,
    dimensionId: string,
    updater: (current: DimensionCycleData) => DimensionCycleData,
  ) => void
}

const PrototypeContext = createContext<PrototypeContextValue | null>(null)

const DEFAULT_META: ObservationMeta = {
  date: '01/25/2026',
  center: 'Center 1',
  classroom: 'Bouncing Baby',
  tool: 'PK-3rd',
  numberOfCycles: 3,
}

export function PrototypeProvider({ children }: { children: ReactNode }) {
  const [activeFlowId, setActiveFlowIdState] = useState(resolveInitialFlowId)
  const [stepIndex, setStepIndex] = useState(0)
  const [cycleData, setCycleData] = useState<AllCycleData>(() =>
    createEmptyAllCycleData(DEFAULT_META.numberOfCycles),
  )
  const [cycleNotes, setCycleNotes] = useState<CycleNotesData>(() =>
    createEmptyCycleNotes(DEFAULT_META.numberOfCycles),
  )
  const [settingsOpen, setSettingsOpen] = useState(false)
  const [expandedDimensionId, setExpandedDimensionId] = useState<string | null>(null)
  const [expandedCycleSection, setExpandedCycleSection] = useState<CycleSectionId | null>(() =>
    getDefaultExpandedCycleSection(getFlowById(resolveInitialFlowId())),
  )
  const [includeAllDimensions, setIncludeAllDimensionsState] = useState(true)
  const [focusedDimensionIds, setFocusedDimensionIdsState] = useState<string[]>([])

  useEffect(() => {
    stripInvalidFlowParam()

    const fromUrl = getFlowIdFromUrl()
    if (fromUrl) {
      try {
        localStorage.setItem(FLOW_STORAGE_KEY, fromUrl)
      } catch {
        // ignore storage errors in prototype
      }
    }
  }, [])

  const activeFlow = useMemo(() => getFlowById(activeFlowId), [activeFlowId])
  const currentStep = activeFlow.steps[stepIndex]

  const clearCycleDataForDimensions = useCallback((dimensionIds: string[]) => {
    if (dimensionIds.length === 0) return

    setCycleData((current) => {
      const next = { ...current }
      for (const cycleNumber of Object.keys(next)) {
        const cycle = { ...next[Number(cycleNumber)] }
        for (const dimensionId of dimensionIds) {
          if (cycle[dimensionId]) {
            cycle[dimensionId] = createEmptyDimensionData(dimensionId)
          }
        }
        next[Number(cycleNumber)] = cycle
      }
      return next
    })
  }, [])

  const resetSession = useCallback(
    (flowId: string) => {
      const flow = getFlowById(flowId)
      setStepIndex(0)
      setCycleData(createEmptyAllCycleData(DEFAULT_META.numberOfCycles))
      setCycleNotes(createEmptyCycleNotes(DEFAULT_META.numberOfCycles))
      setExpandedDimensionId(null)
      setExpandedCycleSection(getDefaultExpandedCycleSection(flow))
      setIncludeAllDimensionsState(true)
      setFocusedDimensionIdsState([])
      setActiveFlowIdState(flowId)
      try {
        localStorage.setItem(FLOW_STORAGE_KEY, flowId)
      } catch {
        // ignore storage errors in prototype
      }
      setFlowInUrl(flowId)
    },
    [],
  )

  const applyDimensionSelection = useCallback(
    (includeAll: boolean, focusedIds: string[]) => {
      setIncludeAllDimensionsState((previousIncludeAll) => {
        setFocusedDimensionIdsState((previousFocusedIds) => {
          const previousActive = previousIncludeAll ? ALL_DIMENSION_IDS : previousFocusedIds
          const nextActive = includeAll ? ALL_DIMENSION_IDS : focusedIds
          const removedIds = previousActive.filter((id) => !nextActive.includes(id))

          if (removedIds.length > 0) {
            clearCycleDataForDimensions(removedIds)
          }

          return focusedIds
        })
        return includeAll
      })
    },
    [clearCycleDataForDimensions],
  )

  const selectAllDimensions = useCallback(() => {
    applyDimensionSelection(true, [])
  }, [applyDimensionSelection])

  const setAllDimensionsRowChecked = useCallback(
    (checked: boolean) => {
      if (checked) {
        selectAllDimensions()
        return
      }
      applyDimensionSelection(false, [])
    },
    [applyDimensionSelection, selectAllDimensions],
  )

  const toggleDimensionInSelection = useCallback(
    (dimensionId: string) => {
      if (includeAllDimensions) {
        applyDimensionSelection(
          false,
          ALL_DIMENSION_IDS.filter((id) => id !== dimensionId),
        )
        return
      }

      const isSelected = focusedDimensionIds.includes(dimensionId)
      const nextFocusedIds = isSelected
        ? focusedDimensionIds.filter((id) => id !== dimensionId)
        : [...focusedDimensionIds, dimensionId]

      if (!isSelected && nextFocusedIds.length === ALL_DIMENSION_IDS.length) {
        selectAllDimensions()
        return
      }

      applyDimensionSelection(false, nextFocusedIds)
    },
    [applyDimensionSelection, focusedDimensionIds, includeAllDimensions, selectAllDimensions],
  )

  const removeDimensionFromSelection = useCallback(
    (dimensionId: string) => {
      if (includeAllDimensions) return
      applyDimensionSelection(
        false,
        focusedDimensionIds.filter((id) => id !== dimensionId),
      )
    },
    [applyDimensionSelection, focusedDimensionIds, includeAllDimensions],
  )

  const getActiveDimensions = useCallback((): ClassDimension[] => {
    if (includeAllDimensions) {
      return CLASS_DIMENSIONS
    }
    return CLASS_DIMENSIONS.filter((dimension) => focusedDimensionIds.includes(dimension.id))
  }, [includeAllDimensions, focusedDimensionIds])

  const setActiveFlow = useCallback(
    (flowId: string) => {
      resetSession(flowId)
    },
    [resetSession],
  )

  const restart = useCallback(() => {
    resetSession(activeFlowId)
  }, [activeFlowId, resetSession])

  const goNext = useCallback(() => {
    setStepIndex((current) => Math.min(current + 1, activeFlow.steps.length - 1))
    setExpandedDimensionId(null)
  }, [activeFlow])

  const goToSummary = useCallback(() => {
    const summaryIndex = activeFlow.steps.findIndex((step) => step.type === 'summary')
    if (summaryIndex >= 0) {
      setStepIndex(summaryIndex)
      setExpandedDimensionId(null)
    }
  }, [activeFlow])

  const goToComplete = useCallback(() => {
    const completeIndex = activeFlow.steps.findIndex((step) => step.type === 'complete')
    if (completeIndex >= 0) {
      setStepIndex(completeIndex)
      setExpandedDimensionId(null)
    }
  }, [activeFlow])

  const goBack = useCallback(() => {
    setStepIndex((current) => Math.max(current - 1, 0))
    setExpandedDimensionId(null)
  }, [])

  const updateDimensionData = useCallback(
    (
      cycleNumber: number,
      dimensionId: string,
      updater: (current: DimensionCycleData) => DimensionCycleData,
    ) => {
      setCycleData((current) => {
        const cycle = current[cycleNumber]
        const dimension = cycle[dimensionId]
        return {
          ...current,
          [cycleNumber]: {
            ...cycle,
            [dimensionId]: updater(dimension),
          },
        }
      })
    },
    [],
  )

  const toggleCycleSection = useCallback((sectionId: CycleSectionId) => {
    setExpandedCycleSection((current) => (current === sectionId ? null : sectionId))
  }, [])

  const addCycleNote = useCallback(
    (cycleNumber: number, text: string, dimensionId: string | null = null) => {
      const trimmed = text.trim()
      if (!trimmed) return

      const note: CycleNote = {
        id: crypto.randomUUID(),
        text: trimmed,
        dimensionId,
      }

      setCycleNotes((current) => ({
        ...current,
        [cycleNumber]: [note, ...(current[cycleNumber] ?? [])],
      }))
    },
    [],
  )

  const updateCycleNote = useCallback(
    (
      cycleNumber: number,
      noteId: string,
      patch: Partial<Pick<CycleNote, 'text' | 'dimensionId'>>,
    ) => {
      setCycleNotes((current) => {
        const notes = current[cycleNumber] ?? []
        return {
          ...current,
          [cycleNumber]: notes.map((note) =>
            note.id === noteId ? { ...note, ...patch } : note,
          ),
        }
      })
    },
    [],
  )

  const deleteCycleNote = useCallback((cycleNumber: number, noteId: string) => {
    setCycleNotes((current) => {
      const notes = current[cycleNumber] ?? []
      return {
        ...current,
        [cycleNumber]: notes.filter((note) => note.id !== noteId),
      }
    })
  }, [])

  const getNotesForDimension = useCallback(
    (cycleNumber: number, dimensionId: string): CycleNote[] => {
      return (cycleNotes[cycleNumber] ?? []).filter((note) => note.dimensionId === dimensionId)
    },
    [cycleNotes],
  )

  const getUntaggedNotes = useCallback(
    (cycleNumber: number): CycleNote[] => {
      return (cycleNotes[cycleNumber] ?? []).filter((note) => note.dimensionId == null)
    },
    [cycleNotes],
  )

  const value = useMemo<PrototypeContextValue>(
    () => ({
      activeFlow,
      activeFlowId,
      stepIndex,
      currentStep,
      observationMeta: DEFAULT_META,
      cycleData,
      cycleNotes,
      settingsOpen,
      expandedDimensionId,
      expandedCycleSection,
      includeAllDimensions,
      focusedDimensionIds,
      setSettingsOpen,
      setActiveFlow,
      selectAllDimensions,
      setAllDimensionsRowChecked,
      toggleDimensionInSelection,
      removeDimensionFromSelection,
      getActiveDimensions,
      goNext,
      goToSummary,
      goToComplete,
      goBack,
      restart,
      setExpandedDimensionId,
      toggleCycleSection,
      addCycleNote,
      updateCycleNote,
      deleteCycleNote,
      getNotesForDimension,
      getUntaggedNotes,
      updateDimensionData,
    }),
    [
      activeFlow,
      activeFlowId,
      stepIndex,
      currentStep,
      cycleData,
      cycleNotes,
      settingsOpen,
      expandedDimensionId,
      expandedCycleSection,
      includeAllDimensions,
      focusedDimensionIds,
      setActiveFlow,
      selectAllDimensions,
      setAllDimensionsRowChecked,
      toggleDimensionInSelection,
      removeDimensionFromSelection,
      getActiveDimensions,
      goNext,
      goToSummary,
      goToComplete,
      goBack,
      restart,
      toggleCycleSection,
      addCycleNote,
      updateCycleNote,
      deleteCycleNote,
      getNotesForDimension,
      getUntaggedNotes,
      updateDimensionData,
    ],
  )

  return <PrototypeContext.Provider value={value}>{children}</PrototypeContext.Provider>
}

export function usePrototype() {
  const context = useContext(PrototypeContext)
  if (!context) {
    throw new Error('usePrototype must be used within PrototypeProvider')
  }
  return context
}

export function getCurrentCycleNumber(step: FlowStep): number | null {
  return step.type === 'cycle' ? step.cycleNumber : null
}
