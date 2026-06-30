import type { ReactNode } from 'react'

type CycleSectionAccordionProps = {
  title: string
  subtitle: string
  expanded: boolean
  onToggle: () => void
  children?: ReactNode
  className?: string
  bodyClassName?: string
}

export function CycleSectionAccordion({
  title,
  subtitle,
  expanded,
  onToggle,
  children,
  className = '',
  bodyClassName = 'px-8 py-6',
}: CycleSectionAccordionProps) {
  return (
    <section className={`rounded-lg bg-white shadow-sm ${className}`}>
      <div
        role="button"
        tabIndex={0}
        aria-expanded={expanded}
        onClick={onToggle}
        onKeyDown={(event) => {
          if (event.key === 'Enter' || event.key === ' ') {
            event.preventDefault()
            onToggle()
          }
        }}
        className="cursor-pointer border-b border-gray-100 px-8 py-6"
      >
        <div className="flex items-center gap-5">
          <span className="text-2xl text-teachstone-teal">{expanded ? '−' : '+'}</span>
          <div>
            <h2 className="text-2xl font-semibold text-teachstone-navy">{title}</h2>
            <p className="text-sm text-teachstone-muted">{subtitle}</p>
          </div>
        </div>
      </div>

      {expanded && children != null && <div className={bodyClassName}>{children}</div>}
    </section>
  )
}
