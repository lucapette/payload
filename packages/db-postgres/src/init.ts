/* eslint-disable no-param-reassign */
import type { Init } from 'payload/database'
import type { SanitizedCollectionConfig } from 'payload/types'

import { pgEnum } from 'drizzle-orm/pg-core'
import { buildVersionCollectionFields, buildVersionGlobalFields } from 'payload/versions'

import type { PostgresAdapter } from './types'

import { buildTable } from './schema/build'
import { getConfigIDType } from './schema/getConfigIDType'
import { getTableName } from './schema/getTableName'

export const init: Init = async function init(this: PostgresAdapter) {
  if (this.payload.config.localization) {
    this.enums.enum__locales = pgEnum(
      '_locales',
      this.payload.config.localization.locales.map(({ code }) => code) as [string, ...string[]],
    )
  }

  this.payload.config.collections.forEach((collection: SanitizedCollectionConfig) => {
    const tableName = getTableName({
      adapter: this,
      config: collection,
    })

    buildTable({
      adapter: this,
      buildNumbers: true,
      buildRelationships: true,
      buildTexts: true,
      disableNotNull: !!collection?.versions?.drafts,
      disableUnique: false,
      fields: collection.fields,
      tableName,
      timestamps: collection.timestamps,
      versions: false,
    })

    if (collection.versions) {
      const versionsTableName = getTableName({
        adapter: this,
        config: collection,
        versions: true,
      })
      const versionFields = buildVersionCollectionFields(collection)

      buildTable({
        adapter: this,
        buildNumbers: true,
        buildRelationships: true,
        buildTexts: true,
        disableNotNull: !!collection.versions?.drafts,
        disableUnique: true,
        fields: versionFields,
        tableName: versionsTableName,
        timestamps: true,
        versions: true,
      })
    }
  })

  this.payload.config.globals.forEach((global) => {
    const tableName = getTableName({ adapter: this, config: global })

    buildTable({
      adapter: this,
      buildNumbers: true,
      buildRelationships: true,
      buildTexts: true,
      disableNotNull: !!global?.versions?.drafts,
      disableUnique: false,
      fields: global.fields,
      tableName,
      timestamps: false,
      versions: false,
    })

    if (global.versions) {
      const versionsTableName = getTableName({ adapter: this, config: global, versions: true })
      const versionFields = buildVersionGlobalFields(global)

      buildTable({
        adapter: this,
        buildNumbers: true,
        buildRelationships: true,
        buildTexts: true,
        disableNotNull: !!global.versions?.drafts,
        disableUnique: true,
        fields: versionFields,
        tableName: versionsTableName,
        timestamps: true,
        versions: true,
      })
    }
  })
}
