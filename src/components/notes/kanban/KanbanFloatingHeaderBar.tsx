import { useEffect, useState, type RefObject } from 'react'

type FloatingHeaderColumn = {
  columnId: string
  title: string
  noteCount: number
}

type KanbanFloatingHeaderBarProps = {
  scrollWrapperRef: RefObject<HTMLDivElement | null>
  columns: FloatingHeaderColumn[]
}

/**
 * A stand-in for the real column headers, rendered outside the horizontally
 * scrollable row so it can stick to the actual viewport.
 *
 * Native `position: sticky` can't do this here: the row wrapper needs
 * `overflow-x: auto` for horizontal scrolling, and per the CSS spec that
 * forces `overflow-y` to compute as `auto` too, which silently makes the
 * wrapper (not the page) the sticky containing block - so a sticky header
 * inside it just sits at its normal position and scrolls away with everything
 * else. Instead, this bar tracks the wrapper's on-screen position and the
 * row's scrollLeft directly, so it can float independently at the top of the
 * viewport and stay horizontally in sync with the columns underneath it.
 */
export function KanbanFloatingHeaderBar({
  scrollWrapperRef,
  columns,
}: KanbanFloatingHeaderBarProps) {
  const [barRect, setBarRect] = useState<{ left: number; width: number } | null>(null)
  const [isVisible, setIsVisible] = useState(false)
  const [scrollLeft, setScrollLeft] = useState(0)

  useEffect(() => {
    const wrapper = scrollWrapperRef.current
    if (!wrapper) return

    const syncPosition = () => {
      const rect = wrapper.getBoundingClientRect()
      setBarRect({ left: rect.left, width: rect.width })
      // The real column headers live right at the top of `rect`. Once that
      // point scrolls above the viewport - and some of the board is still
      // visible below it - this floating bar takes over as their stand-in.
      setIsVisible(rect.top <= 0 && rect.bottom > 0)
    }

    const syncScrollLeft = () => setScrollLeft(wrapper.scrollLeft)

    syncPosition()
    syncScrollLeft()

    window.addEventListener('scroll', syncPosition, { passive: true })
    window.addEventListener('resize', syncPosition)
    wrapper.addEventListener('scroll', syncScrollLeft, { passive: true })

    return () => {
      window.removeEventListener('scroll', syncPosition)
      window.removeEventListener('resize', syncPosition)
      wrapper.removeEventListener('scroll', syncScrollLeft)
    }
  }, [scrollWrapperRef])

  if (!isVisible || !barRect) return null

  return (
    <div
      className="fixed top-0 z-30 overflow-hidden border-b border-gray-300 px-1"
      style={{ left: barRect.left, width: barRect.width }}
      aria-hidden
    >
      <div className="flex gap-4" style={{ transform: `translateX(${-scrollLeft}px)` }}>
        {columns.map((column) => (
          <div key={column.columnId} className="w-[260px] shrink-0 bg-[#f4f8fa] px-4 py-3">
            <div className="flex items-baseline justify-between gap-2">
              <h3
                className="min-w-0 flex-1 truncate text-sm font-semibold text-teachstone-navy"
                title={column.title}
              >
                {column.title}
              </h3>
              <span className="shrink-0 rounded-full bg-teachstone-teal px-2.5 py-0.5 text-xs font-semibold text-white">
                {column.noteCount === 1 ? '1 note' : `${column.noteCount} notes`}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
