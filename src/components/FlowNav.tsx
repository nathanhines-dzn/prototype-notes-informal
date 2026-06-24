import { ArrowLeft, ArrowRight } from '../components/layout/icons'
import { usePrototype } from '../context/PrototypeContext'

type FlowNavProps = {
  showBack?: boolean
  nextLabel?: string
  onNext?: () => void
  onBack?: () => void
}

export function FlowNav({
  showBack = true,
  nextLabel = 'Next',
  onNext,
  onBack,
}: FlowNavProps) {
  const { goBack, goNext } = usePrototype()

  return (
    <div className="flex items-center justify-between border-t border-gray-200 px-8 py-6">
      {showBack ? (
        <button
          type="button"
          onClick={onBack ?? goBack}
          className="inline-flex items-center gap-3 text-base text-teachstone-teal hover:underline"
        >
          <span className="flex h-9 w-9 items-center justify-center rounded-full border border-teachstone-teal">
            <ArrowLeft className="h-5 w-5" />
          </span>
          Back
        </button>
      ) : (
        <div />
      )}

      <button
        type="button"
        onClick={onNext ?? goNext}
        className="inline-flex items-center gap-3 text-base text-teachstone-teal hover:underline"
      >
        {nextLabel}
        <span className="flex h-9 w-9 items-center justify-center rounded-full border border-teachstone-teal">
          <ArrowRight className="h-5 w-5" />
        </span>
      </button>
    </div>
  )
}
