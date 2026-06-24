import type { CSSProperties } from 'react'

const HEARTS = [
  { left: '18%', delay: '0s', drift: '-8px', duration: '1.4s' },
  { left: '42%', delay: '0.35s', drift: '-2px', duration: '1.6s' },
  { left: '68%', delay: '0.7s', drift: '6px', duration: '1.3s' },
  { left: '88%', delay: '1.05s', drift: '10px', duration: '1.5s' },
] as const

export function FeedbackButton() {
  return (
    <div className="feedback-button-wrap relative">
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
        className="feedback-button relative z-10 block rounded-[20px_20px_20px_0px] bg-orange-500 px-4 py-2 text-sm font-semibold text-white shadow-lg transition hover:bg-orange-400"
      >
        Give us feedback
      </a>
    </div>
  )
}
