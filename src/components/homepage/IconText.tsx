import React from 'react'

import { LucideIcon } from '@/components/LucideIcon'
import { normalizeIconTextValue, resolveLucideName } from '@/components/homepage/utils'

export const IconText: React.FC<{
  containerClassName: string
  iconClassName: string
  textClassName: string
  value: unknown
}> = ({ containerClassName, iconClassName, textClassName, value }) => {
  const iconText = normalizeIconTextValue(value)

  if (!iconText?.text) return null

  const iconName = resolveLucideName(iconText.icon)

  return (
    <div className={containerClassName}>
      {iconName ? <LucideIcon className={iconClassName} name={iconName} /> : null}
      <p className={textClassName}>{iconText.text}</p>
    </div>
  )
}
