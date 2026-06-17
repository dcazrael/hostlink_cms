import * as React from 'react'

export type CompanyInfoItem = {
  label: string
  value: React.ReactNode
}

export type CompanyInfoTableProps = {
  items: CompanyInfoItem[]
  labelHeader?: string
  valueHeader?: string
  className?: string
}

/**
 * Fixed label/value table that mirrors the hostlink company-info
 * pattern. Layout, colors, and chip styling are part of the
 * pattern contract and are not exposed as controls.
 *
 * @summary company-information label/value table
 */
export const CompanyInfoTable: React.FC<CompanyInfoTableProps> = ({
  items,
  labelHeader = '項目',
  valueHeader = '内容',
  className,
}) => (
  <div className={className ?? 'max-w-md bg-card p-2'} data-testid="pattern-company-info-table">
    <table className="w-full border-separate border-spacing-x-4 border-spacing-y-2 text-sm text-(--heading)">
      <thead>
        <tr>
          <th className="w-1/3 px-3 pb-1 text-center text-base font-semibold tracking-wide">
            {labelHeader}
          </th>
          <th className="px-4 pb-1 text-center text-base font-semibold tracking-wide">
            {valueHeader}
          </th>
        </tr>
      </thead>
      <tbody>
        {items.map((item) => (
          <tr key={item.label}>
            <th scope="row" className="text-center align-middle font-medium tracking-wide">
              <span className="inline-block w-full bg-accent px-3 py-1.5 text-accent-foreground">
                {item.label}
              </span>
            </th>
            <td className="bg-primary/20 px-3 py-2.5 align-middle font-mono font-medium text-base tracking-wide text-(--heading)">
              {item.value}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
)
