import type { PaginateOptions, Schema } from 'mongoose'
import type { SanitizedConfig } from 'payload/config'
import type { SanitizedCollectionConfig } from 'payload/types'

import paginate from 'mongoose-paginate-v2'

import getBuildQueryPlugin from '../queries/buildQuery.js'
import buildSchema from './buildSchema.js'

const buildCollectionSchema = (
  collection: SanitizedCollectionConfig,
  config: SanitizedConfig,
  schemaOptions = {},
): Schema => {
  const schema = buildSchema(config, collection.fields, {
    draftsEnabled: Boolean(typeof collection?.versions === 'object' && collection.versions.drafts),
    indexSortableFields: config.indexSortableFields,
    options: {
      minimize: false,
      timestamps: collection.timestamps !== false,
      ...schemaOptions,
    },
  })

  if (config.indexSortableFields && collection.timestamps !== false) {
    schema.index({ updatedAt: 1 })
    schema.index({ createdAt: 1 })
  }
  if (collection.indexes) {
    collection.indexes.forEach((index) => {
      schema.index(index.fields, index.options)
    })
  }
  schema
    .plugin<any, PaginateOptions>(paginate, { useEstimatedCount: true })
    .plugin(getBuildQueryPlugin({ collectionSlug: collection.slug }))

  return schema
}

export default buildCollectionSchema