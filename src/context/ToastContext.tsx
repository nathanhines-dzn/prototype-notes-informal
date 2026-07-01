import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from 'react'
import { Check } from '../components/layout/icons'

const TOAST_DURATION_MS = 2000
const TOAST_EXIT_MS = 400

type ToastState = {
  id: number
  message: string
  phase: 'enter' | 'exit'
}

type ToastContextValue = {
  showToast: (message: string) => void
}

const ToastContext = createContext<ToastContextValue | null>(null)

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toast, setToast] = useState<ToastState | null>(null)
  const [liveMessage, setLiveMessage] = useState('')
  const dismissTimeoutRef = useRef<number | null>(null)
  const exitTimeoutRef = useRef<number | null>(null)
  const toastIdRef = useRef(0)

  const clearTimers = useCallback(() => {
    if (dismissTimeoutRef.current != null) {
      window.clearTimeout(dismissTimeoutRef.current)
      dismissTimeoutRef.current = null
    }
    if (exitTimeoutRef.current != null) {
      window.clearTimeout(exitTimeoutRef.current)
      exitTimeoutRef.current = null
    }
  }, [])

  const dismissToast = useCallback(() => {
    setToast((current) => {
      if (!current || current.phase === 'exit') return current
      return { ...current, phase: 'exit' }
    })

    if (exitTimeoutRef.current != null) {
      window.clearTimeout(exitTimeoutRef.current)
    }

    exitTimeoutRef.current = window.setTimeout(() => {
      setToast(null)
      exitTimeoutRef.current = null
    }, TOAST_EXIT_MS)
  }, [])

  const showToast = useCallback(
    (message: string) => {
      clearTimers()

      toastIdRef.current += 1
      setToast({ id: toastIdRef.current, message, phase: 'enter' })
      setLiveMessage(message)

      dismissTimeoutRef.current = window.setTimeout(() => {
        dismissToast()
        dismissTimeoutRef.current = null
      }, TOAST_DURATION_MS)
    },
    [clearTimers, dismissToast],
  )

  useEffect(() => clearTimers, [clearTimers])

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}

      <div aria-live="polite" aria-atomic="true" className="sr-only">
        {liveMessage}
      </div>

      {toast && (
        <div
          key={toast.id}
          role="status"
          className={`pointer-events-none fixed right-6 bottom-6 z-50 flex items-center gap-3 rounded-lg border border-gray-200 bg-white px-4 py-3 text-sm font-medium text-teachstone-navy shadow-lg ${
            toast.phase === 'enter' ? 'toast-enter' : 'toast-exit'
          }`}
        >
          <span
            className="inline-flex size-4 shrink-0 items-center justify-center rounded-full bg-teachstone-complete"
            aria-hidden="true"
          >
            <Check className="size-2.5 text-white" />
          </span>
          {toast.message}
        </div>
      )}
    </ToastContext.Provider>
  )
}

export function useToast() {
  const context = useContext(ToastContext)
  if (!context) {
    throw new Error('useToast must be used within ToastProvider')
  }
  return context
}
