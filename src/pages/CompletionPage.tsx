import { usePrototype } from '../context/PrototypeContext'

export function CompletionPage() {
  const { activeFlow, restart } = usePrototype()

  return (
    <div className="flex min-h-[60vh] items-center justify-center px-8 py-16">
      <div className="w-full max-w-lg rounded-xl bg-white p-10 text-center shadow-sm">
        <h1 className="text-2xl font-semibold text-teachstone-navy">Observation complete</h1>
        <p className="mt-4 text-base text-teachstone-muted">
          You finished the {activeFlow.label.toLowerCase()} prototype flow. Restart to run through
          it again or switch flows in settings.
        </p>
        <button
          type="button"
          onClick={restart}
          className="mt-8 rounded bg-teachstone-teal px-6 py-3 text-base font-medium text-white hover:bg-[#016688]"
        >
          Restart prototype
        </button>
      </div>
    </div>
  )
}
