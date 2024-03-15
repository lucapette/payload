'use client'
import { getTranslation } from '@payloadcms/translations'
import React from 'react'

import type { Props } from './types.js'

import { useTranslation } from '../../providers/Translation/index.js'
import { useFieldProps } from '../FieldPropsProvider/index.js'
import './index.scss'

const baseClass = 'field-description'

const FieldDescription: React.FC<Props> = (props) => {
  const { className, description, marginPlacement } = props

  const { path } = useFieldProps()

  const { i18n } = useTranslation()

  if (description) {
    return (
      <div
        className={[
          baseClass,
          className,
          `field-description-${path.replace(/\./g, '__')}`,
          marginPlacement && `${baseClass}--margin-${marginPlacement}`,
        ]
          .filter(Boolean)
          .join(' ')}
      >
        {getTranslation(description, i18n)}
      </div>
    )
  }

  return null
}

export default FieldDescription
