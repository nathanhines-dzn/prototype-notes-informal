import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from 'react'
import { DEFAULT_FLOW_ID, getFlowById } from '../config/flows'
import {
  CLASS_DIMENSIONS,
  createEmptyAllCycleData,
  createEmptyDimensionData,
} from '../data/classDimensions'
import type {
  AllCycleData,
  ClassDimension,
  DimensionCycleData,
  FlowDefinition,
  FlowStep,
  ObservationMeta,
} from '../types'

const STORAGE_KEY = 'class-notes-prototype-flow-id'

type PrototypeContextValue = {
  activeFlow: FlowDefinition
  activeFlowId: string
  stepIndex: number
  currentStep: FlowStep
  observationMeta: ObservationMeta
  cycleData: AllCycleData
  settingsOpen: boolean
  expandedDimensionId: string | null
  includeAllDimensions: boolean
  focusedDimensionIds: string[]
  setSettingsOpen: (open: boolean) => void
  setActiveFlow: (flowId: string) => void
  setIncludeAllDimensions: (checked: boolean) => void
  setFocusedDimensionIds: (ids: string[]) => void
  getActiveDimensions: () => ClassDimension[]
  goNext: () => void
  goToComplete: () => void
  goBack: () => void
  restart: () => void
  setExpandedDimensionId: (dimensionId: string | null) => void
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

function readStoredFlowId(): string {
  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (stored && getFlowById(stored)) {
      return stored
    }
  } catch {
    // ignore storage errors in prototype
  }
  return DEFAULT_FLOW_ID
}

export function PrototypeProvider({ children }: { children: ReactNode }) {
  const [activeFlowId, setActiveFlowIdState] = useState(readStoredFlowId)
  const [stepIndex, setStepIndex] = useState(0)
  const [cycleData, setCycleData] = useState<AllCycleData>(() =>
    createEmptyAllCycleData(DEFAULT_META.numberOfCycles),
  )
  const [settingsOpen, setSettingsOpen] = useState(false)
  const [expandedDimensionId, setExpandedDimensionId] = useState<string | null>(null)
  const [includeAllDimensions, setIncludeAllDimensionsState] = useState(true)
  const [focusedDimensionIds, setFocusedDimensionIdsState] = useState<string[]>([])

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
      setStepIndex(0)
      setCycleData(createEmptyAllCycleData(DEFAULT_META.numberOfCycles))
      setExpandedDimensionId(null)
      setIncludeAllDimensionsState(true)
      setFocusedDimensionIdsState([])
      setActiveFlowIdState(flowId)
      try {
        localStorage.setItem(STORAGE_KEY, flowId)
      } catch {
        // ignore storage errors in prototype
      }
    },
    [],
  )

  const setIncludeAllDimensions = useCallback((checked: boolean) => {
    setIncludeAllDimensionsState(checked)
    if (checked) {
      setFocusedDimensionIdsState([])
    }
  }, [])

  const setFocusedDimensionIds = useCallback(
    (ids: string[]) => {
      setFocusedDimensionIdsState((current) => {
        const removedIds = current.filter((id) => !ids.includes(id))
        if (removedIds.length > 0) {
          clearCycleDataForDimensions(removedIds)
        }
        return ids
      })
    },
    [clearCycleDataForDimensions],
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

  const value = useMemo<PrototypeContextValue>(
    () => ({
      activeFlow,
      activeFlowId,
      stepIndex,
      currentStep,
      observationMeta: DEFAULT_META,
      cycleData,
      settingsOpen,
      expandedDimensionId,
      includeAllDimensions,
      focusedDimensionIds,
      setSettingsOpen,
      setActiveFlow,
      setIncludeAllDimensions,
      setFocusedDimensionIds,
      getActiveDimensions,
      goNext,
      goToComplete,
      goBack,
      restart,
      setExpandedDimensionId,
      updateDimensionData,
    }),
    [
      activeFlow,
      activeFlowId,
      stepIndex,
      currentStep,
      cycleData,
      settingsOpen,
      expandedDimensionId,
      includeAllDimensions,
      focusedDimensionIds,
      setActiveFlow,
      setIncludeAllDimensions,
      setFocusedDimensionIds,
      getActiveDimensions,
      goNext,
      goToComplete,
      goBack,
      restart,
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
