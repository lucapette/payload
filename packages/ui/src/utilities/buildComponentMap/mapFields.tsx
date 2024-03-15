import type { CellProps, Field, FieldWithPath, LabelProps, SanitizedConfig } from 'payload/types'

import { fieldAffectsData, fieldIsPresentationalOnly } from 'payload/types'
import { isPlainObject } from 'payload/utilities'
import React, { Fragment } from 'react'

import type { Props as FieldDescription } from '../../forms/FieldDescription/types.js'
import type { FormFieldBase } from '../../forms/fields/shared.js'
import type { FieldMap, MappedField, MappedTab, ReducedBlock } from './types.js'

import { RenderCustomComponent } from '../../elements/RenderCustomComponent/index.js'
import { SortColumn } from '../../elements/SortColumn/index.js'
import DefaultError from '../../forms/Error/index.js'
import DefaultDescription from '../../forms/FieldDescription/index.js'
import DefaultLabel from '../../forms/Label/index.js'
import HiddenInput from '../../forms/fields/HiddenInput/index.js'
import { fieldTypes } from '../../forms/fields/index.js'

export const mapFields = (args: {
  DefaultCell?: React.FC<any>
  config: SanitizedConfig
  /**
   * If mapFields is used outside of collections, you might not want it to add an id field
   */
  disableAddingID?: boolean
  fieldSchema: FieldWithPath[]
  filter?: (field: Field) => boolean
  parentPath?: string
  readOnly?: boolean
}): FieldMap => {
  const {
    DefaultCell,
    config,
    disableAddingID,
    fieldSchema,
    filter,
    parentPath,
    readOnly: readOnlyOverride,
  } = args

  const result: FieldMap = fieldSchema.reduce((acc, field): FieldMap => {
    const fieldIsPresentational = fieldIsPresentationalOnly(field)
    let FieldComponent = field.admin?.components?.Field || fieldTypes[field.type]

    if (fieldIsPresentational || (!field?.hidden && field?.admin?.disabled !== true)) {
      if ((filter && typeof filter === 'function' && filter(field)) || !filter) {
        if (field.admin && 'hidden' in field.admin && field?.admin?.hidden) {
          FieldComponent = fieldTypes.hidden
        }

        const isFieldAffectingData = fieldAffectsData(field)

        const path = `${parentPath ? `${parentPath}.` : ''}${
          field.path || (isFieldAffectingData && 'name' in field ? field.name : '')
        }`

        const labelProps: LabelProps = {
          // @ts-expect-error-next-line
          label: 'label' in field ? field.label : null,
          required: 'required' in field ? field.required : undefined,
        }

        const descriptionProps: FieldDescription = {
          description:
            field.admin &&
            'description' in field.admin &&
            (typeof field.admin?.description === 'string' ||
              typeof field.admin?.description === 'object')
              ? field.admin.description
              : undefined,
        }

        const nestedFieldMap =
          'fields' in field &&
          field.fields &&
          Array.isArray(field.fields) &&
          mapFields({
            DefaultCell,
            config,
            fieldSchema: field.fields,
            filter,
            parentPath: path,
            readOnly: readOnlyOverride,
          })

        // `tabs` fields require a field map of each of its tab's nested fields
        const tabs =
          'tabs' in field &&
          field.tabs &&
          Array.isArray(field.tabs) &&
          field.tabs.map((tab) => {
            const tabFieldMap = mapFields({
              DefaultCell,
              config,
              fieldSchema: tab.fields,
              filter,
              parentPath: path,
              readOnly: readOnlyOverride,
            })

            const reducedTab: MappedTab = {
              name: 'name' in tab ? tab.name : undefined,
              label: tab.label,
              subfields: tabFieldMap,
            }

            return reducedTab
          })

        // `blocks` fields require a field map of each of its block's nested fields
        const blocks =
          'blocks' in field &&
          field.blocks &&
          Array.isArray(field.blocks) &&
          field.blocks.map((block) => {
            const blockFieldMap = mapFields({
              DefaultCell,
              config,
              fieldSchema: block.fields,
              filter,
              parentPath: `${path}.${block.slug}`,
              readOnly: readOnlyOverride,
            })

            const reducedBlock: ReducedBlock = {
              slug: block.slug,
              imageAltText: block.imageAltText,
              imageURL: block.imageURL,
              labels: block.labels,
              subfields: blockFieldMap,
            }

            return reducedBlock
          })

        let RowLabel: React.ReactNode

        if (
          'admin' in field &&
          field.admin.components &&
          'RowLabel' in field.admin.components &&
          field.admin.components.RowLabel &&
          !isPlainObject(field.admin.components.RowLabel)
        ) {
          const CustomRowLabel = field.admin.components.RowLabel as React.ComponentType
          RowLabel = <CustomRowLabel />
        }

        // TODO: these types can get cleaned up
        // i.e. not all fields have `maxRows` or `min` or `max`
        // but this is labor intensive and requires consuming components to be updated
        const fieldComponentProps: FormFieldBase = {
          AfterInput: 'admin' in field &&
            'components' in field.admin &&
            'afterInput' in field.admin.components &&
            Array.isArray(field.admin?.components?.afterInput) && (
              <Fragment>
                {field.admin.components.afterInput.map((Component, i) => (
                  <Component key={i} />
                ))}
              </Fragment>
            ),
          BeforeInput: 'admin' in field &&
            field.admin?.components &&
            'beforeInput' in field.admin.components &&
            Array.isArray(field.admin.components.beforeInput) && (
              <Fragment>
                {field.admin.components.beforeInput.map((Component, i) => (
                  <Component key={i} />
                ))}
              </Fragment>
            ),
          Description: (
            <RenderCustomComponent
              CustomComponent={
                field.admin &&
                'description' in field.admin &&
                field.admin.description &&
                typeof field.admin.description === 'function' &&
                (field.admin.description as React.FC<any>)
              }
              DefaultComponent={DefaultDescription}
              componentProps={descriptionProps}
            />
          ),
          Error: (
            <RenderCustomComponent
              CustomComponent={
                'admin' in field &&
                field.admin.components &&
                'Error' in field.admin.components &&
                field.admin?.components?.Error
              }
              DefaultComponent={DefaultError}
              componentProps={{ path }}
            />
          ),
          Label: (
            <RenderCustomComponent
              CustomComponent={
                'admin' in field &&
                field.admin?.components &&
                'Label' in field.admin.components &&
                field.admin?.components?.Label
              }
              DefaultComponent={DefaultLabel}
              componentProps={labelProps}
            />
          ),
          RowLabel,
          blocks,
          className:
            'admin' in field && 'className' in field.admin ? field?.admin?.className : undefined,
          date: 'admin' in field && 'date' in field.admin ? field.admin.date : undefined,
          disabled: field?.admin && 'disabled' in field.admin ? field.admin?.disabled : false,
          fieldMap: nestedFieldMap,
          hasMany: 'hasMany' in field ? field.hasMany : undefined,
          label: 'label' in field && typeof field.label === 'string' ? field.label : undefined,
          max: 'max' in field ? field.max : undefined,
          maxRows: 'maxRows' in field ? field.maxRows : undefined,
          min: 'min' in field ? field.min : undefined,
          options: 'options' in field ? field.options : undefined,
          placeholder:
            'admin' in field && 'placeholder' in field.admin
              ? field?.admin?.placeholder
              : undefined,
          readOnly:
            'admin' in field && 'readOnly' in field.admin ? field.admin.readOnly : undefined,
          relationTo: 'relationTo' in field ? field.relationTo : undefined,
          richTextComponentMap: undefined,
          step: 'admin' in field && 'step' in field.admin ? field.admin.step : undefined,
          style: 'admin' in field && 'style' in field.admin ? field?.admin?.style : undefined,
          tabs,
          width: 'admin' in field && 'width' in field.admin ? field?.admin?.width : undefined,
        }

        if (
          field.type === 'collapsible' &&
          typeof field.label === 'object' &&
          !isPlainObject(field.label)
        ) {
          const CollapsibleLabel = field.label as unknown as React.ComponentType
          fieldComponentProps.Label = <CollapsibleLabel />
        }

        let Field = <FieldComponent {...fieldComponentProps} />

        const cellComponentProps: CellProps = {
          name: 'name' in field ? field.name : undefined,
          blocks:
            'blocks' in field &&
            field.blocks.map((b) => ({
              slug: b.slug,
              labels: b.labels,
            })),
          dateDisplayFormat:
            'admin' in field && 'date' in field.admin ? field.admin.date.displayFormat : undefined,
          fieldType: field.type,
          isFieldAffectingData,
          label:
            'label' in field && field.label && typeof field.label !== 'function'
              ? field.label
              : undefined,
          labels: 'labels' in field ? field.labels : undefined,
          options: 'options' in field ? field.options : undefined,
        }

        /**
         * Handle RichText Field Components, Cell Components, and component maps
         */
        if (field.type === 'richText' && 'editor' in field) {
          const RichTextFieldComponent = field.editor.FieldComponent
          const RichTextCellComponent = field.editor.CellComponent

          if (typeof field.editor.generateComponentMap === 'function') {
            const result = field.editor.generateComponentMap({ config, schemaPath: path })
            // @ts-expect-error-next-line // TODO: the `richTextComponentMap` is not found on the union type
            fieldComponentProps.richTextComponentMap = result
            cellComponentProps.richTextComponentMap = result
          }

          if (RichTextFieldComponent) {
            Field = <RichTextFieldComponent {...fieldComponentProps} />
          }

          if (RichTextCellComponent) {
            cellComponentProps.CellComponentOverride = <RichTextCellComponent />
          }
        }

        const reducedField: MappedField = {
          name: 'name' in field ? field.name : '',
          type: field.type,
          Cell: (
            <RenderCustomComponent
              CustomComponent={field.admin?.components?.Cell}
              DefaultComponent={DefaultCell}
              componentProps={cellComponentProps}
            />
          ),
          Field,
          Heading: (
            <SortColumn
              disable={
                ('disableSort' in field && Boolean(field.disableSort)) ||
                fieldIsPresentationalOnly(field) ||
                undefined
              }
              label={
                'label' in field && field.label && typeof field.label !== 'function'
                  ? field.label
                  : 'name' in field
                    ? field.name
                    : undefined
              }
              name={'name' in field ? field.name : undefined}
            />
          ),
          blocks,
          disabled: field?.admin && 'disabled' in field.admin ? field.admin?.disabled : false,
          fieldIsPresentational,
          hasMany: 'hasMany' in field ? field.hasMany : undefined,
          isFieldAffectingData,
          isSidebar: 'admin' in field && field.admin?.position === 'sidebar',
          label: 'label' in field && typeof field.label !== 'function' ? field.label : undefined,
          labels: 'labels' in field ? field.labels : undefined,
          localized: 'localized' in field ? field.localized : false,
          options: 'options' in field ? field.options : undefined,
          readOnly:
            'admin' in field && 'readOnly' in field.admin ? field.admin.readOnly : undefined,
          relationTo: 'relationTo' in field ? field.relationTo : undefined,
          subfields: nestedFieldMap,
          tabs,
        }

        if (FieldComponent) {
          acc.push(reducedField)
        }
      }
    }

    return acc
  }, [])

  const hasID =
    result.findIndex(({ name, isFieldAffectingData }) => isFieldAffectingData && name === 'id') > -1

  if (!disableAddingID && !hasID) {
    result.push({
      name: 'id',
      type: 'text',
      Cell: DefaultCell ? <DefaultCell name="id" /> : null,
      Field: <HiddenInput name="id" />,
      Heading: <SortColumn label="ID" name="id" />,
      fieldIsPresentational: false,
      isFieldAffectingData: true,
      isSidebar: false,
      label: 'ID',
      labels: undefined,
      localized: undefined,
      readOnly: false,
      subfields: [],
      tabs: [],
    })
  }

  return result
}
