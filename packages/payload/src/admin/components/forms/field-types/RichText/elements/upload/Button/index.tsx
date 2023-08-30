import React, { Fragment, useCallback } from 'react'
import { useTranslation } from 'react-i18next'
import { ReactEditor, useSlate } from 'slate-react'

import { useListDrawer } from '../../../../../../elements/ListDrawer/index.js'
import UploadIcon from '../../../../../../icons/Upload/index.js'
import ElementButton from '../../Button.js'
import { EnabledRelationshipsCondition } from '../../EnabledRelationshipsCondition.js'
import { injectVoidElement } from '../../injectVoid.js'
import './index.scss'

const baseClass = 'upload-rich-text-button'

const insertUpload = (editor, { relationTo, value }) => {
  const text = { text: ' ' }

  const upload = {
    children: [text],
    relationTo,
    type: 'upload',
    value,
  }

  injectVoidElement(editor, upload)

  ReactEditor.focus(editor)
}

type ButtonProps = {
  enabledCollectionSlugs: string[]
  path: string
}

const UploadButton: React.FC<ButtonProps> = ({ enabledCollectionSlugs }) => {
  const { t } = useTranslation(['upload', 'general'])
  const editor = useSlate()

  const [ListDrawer, ListDrawerToggler, { closeDrawer }] = useListDrawer({
    collectionSlugs: enabledCollectionSlugs,
    uploads: true,
  })

  const onSelect = useCallback(
    ({ collectionConfig, docID }) => {
      insertUpload(editor, {
        relationTo: collectionConfig.slug,
        value: {
          id: docID,
        },
      })
      closeDrawer()
    },
    [editor, closeDrawer],
  )

  return (
    <Fragment>
      <ListDrawerToggler>
        <ElementButton
          onClick={() => {
            // do nothing
          }}
          className={baseClass}
          el="div"
          format="upload"
          tooltip={t('fields:addUpload')}
        >
          <UploadIcon />
        </ElementButton>
      </ListDrawerToggler>
      <ListDrawer onSelect={onSelect} />
    </Fragment>
  )
}

export default (props: ButtonProps): React.ReactNode => {
  return (
    <EnabledRelationshipsCondition {...props} uploads>
      <UploadButton {...props} />
    </EnabledRelationshipsCondition>
  )
}