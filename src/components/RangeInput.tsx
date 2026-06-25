import type { RangeValue } from '../types'

const ALL_OPTIONS: { value: RangeValue; label: string }[] = [
  { value: 'low', label: 'Low' },
  { value: 'mid', label: 'Mid' },
  { value: 'high', label: 'High' },
]

type RangeInputProps = {
  value: RangeValue | null
  onChange: (value: RangeValue | null) => void
  highlightedValues?: RangeValue[]
  options?: RangeValue[]
}

export function RangeInput({ value, onChange, highlightedValues, options }: RangeInputProps) {
  const visibleOptions = options
    ? ALL_OPTIONS.filter((option) => options.includes(option.value))
    : ALL_OPTIONS

  return (
    <div className="flex w-[270px] items-center justify-between gap-[18px]">
      {visibleOptions.map((option) => {
        const selected = value === option.value
        const highlighted = !selected && highlightedValues?.includes(option.value)
        return (
          <button
            key={option.value}
            type="button"
            onClick={() => onChange(selected ? null : option.value)}
            className={`rounded-xl px-6 py-1 text-base transition-colors ${
              selected
                ? 'bg-teachstone-complete text-white'
                : highlighted
                  ? 'bg-teachstone-score-mid text-teachstone-navy shadow-[inset_0_0_0_3px_var(--color-teachstone-score-mid-border)]'
                  : 'bg-white text-teachstone-muted hover:bg-gray-50'
            }`}
          >
            {option.label}
          </button>
        )
      })}
    </div>
  )
}
