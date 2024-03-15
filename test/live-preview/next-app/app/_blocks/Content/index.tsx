import React, { Fragment } from 'react'

import type { Page } from '../../../payload-types'

import { Gutter } from '../../_components/Gutter'
import { CMSLink } from '../../_components/Link'
import RichText from '../../_components/RichText'
import classes from './index.module.scss'

type Props = Extract<Exclude<Page['layout'], undefined>[0], { blockType: 'content' }>

export const ContentBlock: React.FC<
  Props & {
    id?: string
  }
> = (props) => {
  const { columns } = props

  return (
    <Gutter className={classes.content}>
      <div className={classes.grid}>
        {columns && columns.length > 0 ? (
          <Fragment>
            {columns.map((col, index) => {
              const { enableLink, link, richText, size } = col

              return (
                <div className={[classes.column, classes[`column--${size}`]].join(' ')} key={index}>
                  <RichText content={richText} />
                  {enableLink && <CMSLink className={classes.link} {...link} />}
                </div>
              )
            })}
          </Fragment>
        ) : null}
      </div>
    </Gutter>
  )
}
