import { ENVIRONMENT_SCORE } from '../../data/summaryMockData'

export function EnvironmentScoresSection() {
  return (
    <section className="rounded-lg bg-white shadow-sm">
      <div className="flex items-center justify-between border-b border-gray-100 px-8 py-6">
        <h2 className="text-2xl font-semibold text-teachstone-navy">Environment Scores</h2>
        <span className="text-base font-semibold text-teachstone-navy">
          {ENVIRONMENT_SCORE.scoreLabel}
        </span>
      </div>

      <div className="px-8 py-6">
        <div
          className="flex items-center gap-3 rounded-lg px-3 py-3 text-base text-teachstone-muted"
          aria-disabled="true"
        >
          <span className="flex h-5 w-5 items-center justify-center rounded-full border border-gray-300 text-sm text-gray-400">
            +
          </span>
          <span>Expand to view more details</span>
        </div>
      </div>
    </section>
  )
}
