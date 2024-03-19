'use client'
import * as facelessUIImport from '@faceless-ui/window-info'
import { getTranslation } from '@payloadcms/translations'
import { fieldAffectsData } from 'payload/types'
import React, { useState } from 'react'
import AnimateHeightImport from 'react-animate-height'

const AnimateHeight = (AnimateHeightImport.default ||
  AnimateHeightImport) as typeof AnimateHeightImport.default

import type { Props } from './types.js'

import { Chevron } from '../../icons/Chevron/index.js'
import { useSearchParams } from '../../providers/SearchParams/index.js'
import { useTranslation } from '../../providers/Translation/index.js'
import ColumnSelector from '../ColumnSelector/index.js'
import { DeleteMany } from '../DeleteMany/index.js'
import { EditMany } from '../EditMany/index.js'
import Pill from '../Pill/index.js'
import { PublishMany } from '../PublishMany/index.js'
import SearchFilter from '../SearchFilter/index.js'
import { UnpublishMany } from '../UnpublishMany/index.js'
import WhereBuilder from '../WhereBuilder/index.js'
import validateWhereQuery from '../WhereBuilder/validateWhereQuery.js'
import './index.scss'

const baseClass = 'list-controls'

/**
 * The ListControls component is used to render the controls (search, filter, where)
 * for a collection's list view. You can find those directly above the table which lists
 * the collection's documents.
 */
export const ListControls: React.FC<Props> = (props) => {
  const {
    collectionConfig,
    enableColumns = true,
    enableSort = false,
    fieldMap,
    handleSearchChange,
    handleSortChange,
    handleWhereChange,
    modifySearchQuery = true,
    textFieldsToBeSearched,
    titleField,
  } = props

  const { useWindowInfo } = facelessUIImport

  const { searchParams } = useSearchParams()
  const shouldInitializeWhereOpened = validateWhereQuery(searchParams?.where)

  const [visibleDrawer, setVisibleDrawer] = useState<'columns' | 'sort' | 'where'>(
    shouldInitializeWhereOpened ? 'where' : undefined,
  )
  const { i18n, t } = useTranslation()
  const {
    breakpoints: { s: smallBreak },
  } = useWindowInfo()

  return (
    <div className={baseClass}>
      <div className={`${baseClass}__wrap`}>
        <SearchFilter
          fieldLabel={
            (titleField && getTranslation(titleField.label || titleField.name, i18n)) ?? undefined
          }
          fieldName={titleField && fieldAffectsData(titleField) ? titleField.name : undefined}
          handleChange={handleSearchChange}
          listSearchableFields={textFieldsToBeSearched}
          modifySearchQuery={modifySearchQuery}
        />
        <div className={`${baseClass}__buttons`}>
          <div className={`${baseClass}__buttons-wrap`}>
            {!smallBreak && (
              <React.Fragment>
                <EditMany collection={collectionConfig} fieldMap={fieldMap} />
                <PublishMany collection={collectionConfig} />
                <UnpublishMany collection={collectionConfig} />
                <DeleteMany collection={collectionConfig} />
              </React.Fragment>
            )}
            {enableColumns && (
              <Pill
                aria-controls={`${baseClass}-columns`}
                aria-expanded={visibleDrawer === 'columns'}
                className={`${baseClass}__toggle-columns ${
                  visibleDrawer === 'columns' ? `${baseClass}__buttons-active` : ''
                }`}
                icon={<Chevron />}
                onClick={() =>
                  setVisibleDrawer(visibleDrawer !== 'columns' ? 'columns' : undefined)
                }
                pillStyle="light"
              >
                {t('general:columns')}
              </Pill>
            )}
            <Pill
              aria-controls={`${baseClass}-where`}
              aria-expanded={visibleDrawer === 'where'}
              className={`${baseClass}__toggle-where ${
                visibleDrawer === 'where' ? `${baseClass}__buttons-active` : ''
              }`}
              icon={<Chevron />}
              onClick={() => setVisibleDrawer(visibleDrawer !== 'where' ? 'where' : undefined)}
              pillStyle="light"
            >
              {t('general:filters')}
            </Pill>
            {enableSort && (
              <Pill
                aria-controls={`${baseClass}-sort`}
                aria-expanded={visibleDrawer === 'sort'}
                className={`${baseClass}__toggle-sort`}
                icon={<Chevron />}
                onClick={() => setVisibleDrawer(visibleDrawer !== 'sort' ? 'sort' : undefined)}
                pillStyle="light"
              >
                {t('general:sort')}
              </Pill>
            )}
          </div>
        </div>
      </div>
      {enableColumns && (
        <AnimateHeight
          className={`${baseClass}__columns`}
          height={visibleDrawer === 'columns' ? 'auto' : 0}
          id={`${baseClass}-columns`}
        >
          <ColumnSelector collectionSlug={collectionConfig.slug} />
        </AnimateHeight>
      )}
      <AnimateHeight
        className={`${baseClass}__where`}
        height={visibleDrawer === 'where' ? 'auto' : 0}
        id={`${baseClass}-where`}
      >
        <WhereBuilder
          collectionPluralLabel={collectionConfig?.labels?.plural}
          collectionSlug={collectionConfig.slug}
          handleChange={handleWhereChange}
          modifySearchQuery={modifySearchQuery}
        />
      </AnimateHeight>
      {enableSort && (
        <AnimateHeight
          className={`${baseClass}__sort`}
          height={visibleDrawer === 'sort' ? 'auto' : 0}
          id={`${baseClass}-sort`}
        >
          <p>Sort Complex</p>
          {/* <SortComplex
            collection={collection}
            handleChange={handleSortChange}
            modifySearchQuery={modifySearchQuery}
          /> */}
        </AnimateHeight>
      )}
    </div>
  )
}
