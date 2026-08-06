type IconProps = {
  className?: string
  'aria-label'?: string
}

export function Check({ className, 'aria-label': ariaLabel }: IconProps) {
  return (
    <svg
      viewBox="0 0 16 16"
      fill="none"
      className={className}
      aria-label={ariaLabel}
      aria-hidden={!ariaLabel}
    >
      <path
        d="M3 8.5 6.5 12 13 4"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

export function SettingsIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden>
      <path
        d="M12 15.5a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7Z"
        stroke="currentColor"
        strokeWidth="1.8"
      />
      <path
        d="M19.4 13a7.8 7.8 0 0 0 .1-2l2-1.5-2-3.5-2.4 1a8 8 0 0 0-1.7-1L15 3h-4l-.4 2.5a8 8 0 0 0-1.7 1l-2.4-1-2 3.5 2 1.5a7.8 7.8 0 0 0 .1 2l-2 1.5 2 3.5 2.4-1a8 8 0 0 0 1.7 1L11 21h4l.4-2.5a8 8 0 0 0 1.7-1l2.4 1 2-3.5-2-1.5Z"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinejoin="round"
      />
    </svg>
  )
}

export function ArrowLeft({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden>
      <path
        d="M15 6 9 12l6 6"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

export function ArrowRight({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden>
      <path
        d="m9 6 6 6-6 6"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

export function ChevronDown({ className }: IconProps) {
  return (
    <svg viewBox="0 0 16 16" fill="none" className={className} aria-hidden>
      <path
        d="M4 6l4 4 4-4"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

export function Trash({ className, 'aria-label': ariaLabel }: IconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      className={className}
      aria-label={ariaLabel}
      aria-hidden={!ariaLabel}
    >
      <path
        d="M4 7h16M9 7V5a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2M10 11v6M14 11v6M6 7l1 12a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2l1-12"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

/** Six-dot grip used as a drag-handle affordance on reorderable / kanban cards. */
export function GripVertical({ className, 'aria-label': ariaLabel }: IconProps) {
  return (
    <svg
      viewBox="0 0 16 16"
      fill="currentColor"
      className={className}
      aria-label={ariaLabel}
      aria-hidden={!ariaLabel}
    >
      <circle cx="5.5" cy="3.5" r="1.25" />
      <circle cx="10.5" cy="3.5" r="1.25" />
      <circle cx="5.5" cy="8" r="1.25" />
      <circle cx="10.5" cy="8" r="1.25" />
      <circle cx="5.5" cy="12.5" r="1.25" />
      <circle cx="10.5" cy="12.5" r="1.25" />
    </svg>
  )
}

export function InfoIcon({ className, 'aria-label': ariaLabel }: IconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      className={className}
      aria-label={ariaLabel}
      aria-hidden={!ariaLabel}
    >
      <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="2" />
      <path
        d="M12 11v5"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
      <circle cx="12" cy="8" r="1" fill="currentColor" />
    </svg>
  )
}

export function ChatBubbleIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden>
      <path
        d="M12 21a9 9 0 0 0 9-9c0-4.97-4.03-9-9-9S3 7.03 3 12c0 1.49.37 2.9 1.02 4.13L3 21l4.98-1.65A8.96 8.96 0 0 0 12 21Z"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinejoin="round"
      />
      <path
        d="M8.5 12h.01M12 12h.01M15.5 12h.01"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinecap="round"
      />
    </svg>
  )
}

/** Panel-left collapse control for the observation sidebar. */
export function PanelLeftCloseIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden>
      <rect
        x="3"
        y="4"
        width="18"
        height="16"
        rx="2"
        stroke="currentColor"
        strokeWidth="1.8"
      />
      <path d="M9 4v16" stroke="currentColor" strokeWidth="1.8" />
      <path
        d="m15.5 9-3 3 3 3"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

/** Panel-left expand control for the observation sidebar. */
export function PanelLeftOpenIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden>
      <rect
        x="3"
        y="4"
        width="18"
        height="16"
        rx="2"
        stroke="currentColor"
        strokeWidth="1.8"
      />
      <path d="M9 4v16" stroke="currentColor" strokeWidth="1.8" />
      <path
        d="m12.5 9 3 3-3 3"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

/** Circular refresh arrows with the cycle number centered. */
export function CycleIcon({
  className,
  cycleNumber,
  'aria-label': ariaLabel,
}: IconProps & { cycleNumber: number }) {
  return (
    <span
      className={`relative inline-flex items-center justify-center ${className ?? ''}`}
      aria-label={ariaLabel}
      aria-hidden={!ariaLabel}
    >
      <svg viewBox="0 0 24 24" fill="none" className="size-full" aria-hidden>
        <path
          d="M19.5 12a7.5 7.5 0 0 0-12.4-5.66"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
        />
        <path
          d="M7.2 4.8v3.2H10.4"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M4.5 12a7.5 7.5 0 0 0 12.4 5.66"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
        />
        <path
          d="M16.8 19.2v-3.2H13.6"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
      <span className="pointer-events-none absolute inset-0 flex items-center justify-center text-[10px] font-bold leading-none">
        {cycleNumber}
      </span>
    </span>
  )
}

/** Clipboard / evidence list mark for the Evidence step. */
export function EvidenceIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden>
      <path
        d="M9 4h6a1 1 0 0 1 1 1v1h2.5A1.5 1.5 0 0 1 20 7.5v12A1.5 1.5 0 0 1 18.5 21h-13A1.5 1.5 0 0 1 4 19.5v-12A1.5 1.5 0 0 1 5.5 6H8V5a1 1 0 0 1 1-1Z"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinejoin="round"
      />
      <path
        d="M9 4.5h6V6H9V4.5Z"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinejoin="round"
      />
      <path
        d="M8 11h8M8 14.5h8M8 18h5"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
    </svg>
  )
}

/** Document / rollup mark for the Summary step. */
export function SummaryIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden>
      <path
        d="M7 3.5h7.5L19 8v12.5A1.5 1.5 0 0 1 17.5 22h-10A1.5 1.5 0 0 1 6 20.5v-15A2 2 0 0 1 7 3.5Z"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinejoin="round"
      />
      <path
        d="M14.5 3.5V8H19"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinejoin="round"
      />
      <path
        d="M9 12h6M9 15.5h6M9 19h3.5"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
    </svg>
  )
}
