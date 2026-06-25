import type { SummaryTableRow } from '../../data/summaryMockData'

type ScoresDetailTableProps = {
  rows: SummaryTableRow[]
}

export function ScoresDetailTable({ rows }: ScoresDetailTableProps) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[640px] border-collapse text-base text-teachstone-navy">
        <thead>
          <tr className="border-b border-gray-200">
            <th className="w-24 py-4 text-left font-semibold" scope="col">
              <span className="sr-only">Dimension</span>
            </th>
            <th className="py-4 text-center font-semibold" scope="col">
              C1
            </th>
            <th className="py-4 text-center font-semibold" scope="col">
              C2
            </th>
            <th className="py-4 text-center font-semibold" scope="col">
              C3
            </th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={row.dimensionId} className="border-b border-gray-100">
              <td className="py-3 pl-2">
                <div className="flex items-center gap-2">
                  <span className="font-medium">{row.abbr}</span>
                  <span className="text-teachstone-muted" aria-hidden="true">
                    ›
                  </span>
                </div>
              </td>
              {row.cycles.map((value, index) => (
                <td key={`${row.dimensionId}-c${index + 1}`} className="py-3 text-center font-medium">
                  {value}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
