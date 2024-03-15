import type { User } from '../auth/index.js'
import type { PayloadRequest } from '../types/index.js'

export type PreferenceRequest = {
  key: string
  overrideAccess?: boolean
  req: PayloadRequest
  user: User
}

export type PreferenceUpdateRequest = PreferenceRequest & { value: unknown }

export type CollapsedPreferences = string[]

export type TabsPreferences = Array<{
  [path: string]: number
}>

export type InsideFieldsPreferences = {
  collapsed: CollapsedPreferences
  tabIndex: number
}
export type FieldsPreferences = {
  [key: string]: InsideFieldsPreferences
}

export type DocumentPreferences = {
  fields: FieldsPreferences
}
