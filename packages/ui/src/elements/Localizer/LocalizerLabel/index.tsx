import { getTranslation } from '@payloadcms/translations'
import React from 'react'

import { Chevron } from '../../../icons/Chevron/index.js'
import { useLocale } from '../../../providers/Locale/index.js'
import { useTranslation } from '../../../providers/Translation/index.js'
import './index.scss'

const baseClass = 'localizer-button'

export const LocalizerLabel: React.FC<{
  ariaLabel?: string
  className?: string
}> = (props) => {
  const { ariaLabel, className } = props
  const locale = useLocale()
  const { t } = useTranslation()
  const { i18n } = useTranslation()

  return (
    <div
      aria-label={ariaLabel || t('general:locale')}
      className={[baseClass, className].filter(Boolean).join(' ')}
    >
      <div className={`${baseClass}__label`}>{`${t('general:locale')}:`}</div>
      &nbsp;&nbsp;
      <span className={`${baseClass}__current-label`}>
        {`${getTranslation(locale.label, i18n)}`}
      </span>
      &nbsp;
      <Chevron className={`${baseClass}__chevron`} />
    </div>
  )
}
