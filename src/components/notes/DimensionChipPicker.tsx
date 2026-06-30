import type { ClassDimension } from '../../types'

type DimensionChipPickerProps = {
  id: string
  dimensions: ClassDimension[]
  value: string | null
  onChange: (dimensionId: string | null) => void
}

export function DimensionChipPicker({
  id,
  dimensions,
  value,
  onChange,
}: DimensionChipPickerProps) {
  return (
    <div
      role="radiogroup"
      aria-labelledby={`${id}-label`}
      className="flex flex-wrap gap-2"
    >
      <button
        type="button"
        role="radio"
        aria-checked={value === null}
        onClick={() => onChange(null)}
        className={chipClassName(value === null, false)}
      >
        Not assigned
      </button>
      {dimensions.map((dimension) => {
        const selected = value === dimension.id
        return (
          <button
            key={dimension.id}
            type="button"
            role="radio"
            aria-checked={selected}
            title={dimension.name}
            onClick={() => onChange(dimension.id)}
            className={chipClassName(selected, true)}
          >
            {dimension.abbr}
          </button>
        )
      })}
    </div>
  )
}

function chipClassName(selected: boolean, isDimension: boolean) {
  if (selected && isDimension) {
    return 'rounded-full border border-teachstone-teal bg-teachstone-teal/10 px-3 py-1 text-sm font-semibold text-teachstone-teal transition'
  }
  if (selected) {
    return 'rounded-full border border-gray-400 bg-gray-100 px-3 py-1 text-sm font-semibold text-teachstone-navy transition'
  }
  return 'rounded-full border border-gray-300 bg-white px-3 py-1 text-sm font-medium text-teachstone-muted transition hover:border-gray-300 hover:text-teachstone-navy'
}
