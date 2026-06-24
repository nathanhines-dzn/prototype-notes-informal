import type { RangeValue } from '../types'

const OPTIONS: { value: RangeValue; label: string }[] = [
  { value: 'low', label: 'Low' },
  { value: 'mid', label: 'Mid' },
  { value: 'high', label: 'High' },
]

type RangeInputProps = {
  value: RangeValue | null
  onChange: (value: RangeValue | null) => void
}

export function RangeInput({ value, onChange }: RangeInputProps) {
  return (
    <div className="flex items-center gap-[18px]">
      {OPTIONS.map((option) => {
        const selected = value === option.value
        return (
          <button
            key={option.value}
            type="button"
            onClick={() => onChange(selected ? null : option.value)}
            className={`rounded-xl px-6 py-1 text-base transition-colors ${
              selected
                ? 'bg-teachstone-complete text-white'
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
