import {
  FEEDBACK_BY_DIMENSION,
  FEEDBACK_CARDS,
  type SummaryFeedbackByDimension,
  type SummaryFeedbackCard,
} from '../../data/summaryMockData'

function FeedbackCard({ card }: { card: SummaryFeedbackCard }) {
  return (
    <article className="rounded-lg border border-gray-100 bg-teachstone-card px-8 py-8">
      <h3 className="text-xl font-semibold text-teachstone-navy">{card.title}</h3>
      <div className="mt-8 grid gap-8 md:grid-cols-2">
        <div>
          <p className="text-sm font-medium text-teachstone-muted">Dimension</p>
          <p className="mt-1 text-base text-teachstone-navy">{card.dimension}</p>
        </div>
        <div>
          <p className="text-sm font-medium text-teachstone-muted">Indicator</p>
          <p className="mt-1 text-base text-teachstone-navy">{card.indicator}</p>
        </div>
      </div>
      <p className="mt-8 text-base leading-relaxed text-teachstone-navy">{card.body}</p>
      <p className="mt-4 text-base text-teachstone-teal">Read more...</p>
    </article>
  )
}

function FeedbackDimensionList({ items }: { items: SummaryFeedbackByDimension[] }) {
  return (
    <div className="space-y-8">
      {items.map((item) => (
        <div key={item.dimension}>
          <h3 className="text-base font-semibold text-teachstone-navy">{item.dimension}</h3>
          <ul className="mt-3 space-y-2 text-base leading-relaxed text-teachstone-navy">
            {item.bullets.map((bullet) => (
              <li key={bullet} className="flex gap-2">
                <span aria-hidden="true">●</span>
                <span>{bullet}</span>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  )
}

export function ObservationFeedbackSection() {
  return (
    <>
      <section className="rounded-lg bg-white shadow-sm">
        <div className="border-b border-gray-100 px-8 py-6">
          <h2 className="text-2xl font-semibold text-teachstone-navy">Observation Feedback</h2>
        </div>
        <div className="space-y-6 px-8 py-6">
          {FEEDBACK_CARDS.map((card) => (
            <FeedbackCard key={card.title} card={card} />
          ))}
        </div>
      </section>

      <section className="rounded-lg bg-white shadow-sm">
        <div className="border-b border-gray-100 px-8 py-6">
          <h2 className="text-2xl font-semibold text-teachstone-navy">Observation Feedback</h2>
        </div>
        <div className="px-8 py-6">
          <FeedbackDimensionList items={FEEDBACK_BY_DIMENSION} />
        </div>
      </section>
    </>
  )
}
