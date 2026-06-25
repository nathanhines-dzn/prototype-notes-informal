import type { SummaryDomain } from '../../data/summaryMockData'

const DOMAIN_THEMES: Record<string, string> = {
  'Emotional Support': '#fff6f0',
  'Classroom Organization': '#fff3f7',
  'Instructional Support': '#fcf2ff',
}

type ScoresRollupSummaryProps = {
  domains: SummaryDomain[]
}

function DimensionRow({ abbr, value, tint }: { abbr: string; value: string; tint: string }) {
  return (
    <div className="pt-3">
      <div className="flex h-8 items-center justify-between px-4">
        <span className="text-base font-semibold text-teachstone-navy">{abbr}</span>
        <span
          className="inline-flex min-w-[3.625rem] items-center justify-center rounded-xl px-2 py-1 text-base text-teachstone-navy"
          style={{ backgroundColor: tint }}
        >
          {value}
        </span>
      </div>
    </div>
  )
}

function DomainColumn({ domain }: { domain: SummaryDomain }) {
  const tint = DOMAIN_THEMES[domain.name] ?? '#f4f8fa'

  return (
    <div className="flex w-full min-w-0 flex-1 flex-col gap-4">
      <div
        className="flex items-center justify-between rounded-xl px-4 py-2"
        style={{ backgroundColor: tint }}
      >
        <h3 className="max-w-[120px] text-lg font-semibold leading-5 text-teachstone-navy">
          {domain.name}
        </h3>
        {domain.domainAverage && (
          <span className="shrink-0 text-2xl font-bold leading-6 text-teachstone-navy">
            {domain.domainAverage}
          </span>
        )}
      </div>

      <div className="flex flex-col gap-2">
        {domain.dimensions.map((dimension) => (
          <DimensionRow
            key={dimension.abbr}
            abbr={dimension.abbr}
            value={dimension.value}
            tint={tint}
          />
        ))}
      </div>
    </div>
  )
}

export function ScoresRollupSummary({ domains }: ScoresRollupSummaryProps) {
  return (
    <div className="flex flex-row gap-6 lg:justify-between">
      {domains.map((domain) => (
        <DomainColumn key={domain.name} domain={domain} />
      ))}
    </div>
  )
}
