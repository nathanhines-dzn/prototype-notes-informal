import type { CSSProperties } from 'react'
import { ChatBubbleIcon } from './icons'

const FEEDBACK_LABEL = 'Give us feedback'

const HEARTS = [
  { left: '18%', delay: '0s', drift: '-8px', duration: '1.4s' },
  { left: '42%', delay: '0.35s', drift: '-2px', duration: '1.6s' },
  { left: '68%', delay: '0.7s', drift: '6px', duration: '1.3s' },
  { left: '88%', delay: '1.05s', drift: '10px', duration: '1.5s' },
] as const

export function FeedbackButton() {
  return (
    <div className="feedback-button-wrap relative p-0.5">
      <div
        className="pointer-events-none absolute inset-x-0 bottom-0 h-16 overflow-visible"
        aria-hidden
      >
        {HEARTS.map((heart, index) => (
          <span
            key={index}
            className="feedback-heart absolute bottom-2 text-base opacity-0"
            style={
              {
                left: heart.left,
                '--heart-delay': heart.delay,
                '--heart-drift': heart.drift,
                '--heart-duration': heart.duration,
              } as CSSProperties
            }
          >
            ❤️
          </span>
        ))}
      </div>

      <a
        href="https://forms.gle/LFvdUJmqKLnMce5V7"
        target="_blank"
        rel="noopener noreferrer"
        className="feedback-button group relative z-10 inline-flex items-center gap-2 rounded-[20px_20px_20px_0px] bg-orange-500 px-4 py-2 text-sm font-semibold text-white shadow-lg transition hover:bg-orange-400 max-[1299px]:px-2.5 max-[1299px]:py-2.5"
      >
        <ChatBubbleIcon className="size-[16px] shrink-0" />
        <span className="max-[1299px]:sr-only">{FEEDBACK_LABEL}</span>
        <span
          role="tooltip"
          aria-hidden
          className="pointer-events-none absolute bottom-full left-0 z-20 mb-2 whitespace-nowrap rounded-md bg-[#1A0238] px-3 py-1.5 text-xs font-medium text-white opacity-0 shadow-lg transition-opacity duration-150 min-[1300px]:hidden max-[1299px]:group-hover:opacity-100 max-[1299px]:group-focus-visible:opacity-100"
        >
          {FEEDBACK_LABEL}
        </span>
      </a>
    </div>
  )
}
