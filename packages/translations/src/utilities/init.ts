import type { I18n, InitI18n, InitTFunction, Translations } from '../types.js'

import { deepMerge } from './deepMerge.js'

/**
 * @function getTranslationString
 *
 * Gets a translation string from a translations object
 *
 * @returns string
 */
export const getTranslationString = ({
  count,
  key,
  translations,
}: {
  count?: number
  key: string
  translations: Translations[0]
}) => {
  const keys = key.split(':')
  let keySuffix = ''

  const translation: string = keys.reduce((acc: any, key, index) => {
    if (typeof acc === 'string') return acc

    if (typeof count === 'number') {
      if (count === 0 && `${key}_zero` in acc) {
        keySuffix = '_zero'
      } else if (count === 1 && `${key}_one` in acc) {
        keySuffix = '_one'
      } else if (count === 2 && `${key}_two` in acc) {
        keySuffix = '_two'
      } else if (count > 5 && `${key}_many` in acc) {
        keySuffix = '_many'
      } else if (count > 2 && count <= 5 && `${key}_few` in acc) {
        keySuffix = '_few'
      } else if (`${key}_other` in acc) {
        keySuffix = '_other'
      }
    }
    let keyToUse = key
    if (index === keys.length - 1 && keySuffix) {
      keyToUse = `${key}${keySuffix}`
    }

    if (acc && keyToUse in acc) {
      return acc[keyToUse]
    }

    return undefined
  }, translations)

  if (!translation) {
    console.log('key not found: ', key)
  }

  return translation || key
}

/**
 * @function replaceVars
 *
 * Replaces variables in a translation string with values from an object
 *
 * @returns string
 */
const replaceVars = ({
  translationString,
  vars,
}: {
  translationString: string
  vars: {
    [key: string]: any
  }
}) => {
  const parts = translationString.split(/(\{\{.*?\}\})/)

  return parts
    .map((part) => {
      if (part.startsWith('{{') && part.endsWith('}}')) {
        const placeholder = part.substring(2, part.length - 2).trim()
        const value = vars[placeholder]
        return value !== undefined && value !== null ? value : part
      } else {
        return part
      }
    })
    .join('')
}

/**
 * @function t
 *
 * Merges config defined translations with translations passed in as an argument
 * returns a function that can be used to translate a string
 *
 * @returns string
 */
type TFunctionConstructor = ({
  key,
  translations,
  vars,
}: {
  key: string
  translations?: Translations[0]
  vars?: Record<string, any>
}) => string

export const t: TFunctionConstructor = ({ key, translations, vars }) => {
  let translationString = getTranslationString({
    count: typeof vars?.count === 'number' ? vars.count : undefined,
    key,
    translations,
  })

  if (vars) {
    translationString = replaceVars({
      translationString,
      vars,
    })
  }

  if (!translationString) {
    translationString = key
  }

  return translationString
}

type LanguagePreference = {
  language: string
  quality?: number
}

function parseAcceptLanguage(header: string): LanguagePreference[] {
  return header
    .split(',')
    .map((lang) => {
      const [language, quality] = lang.trim().split(';q=')
      return {
        language,
        quality: quality ? parseFloat(quality) : 1,
      }
    })
    .sort((a, b) => b.quality - a.quality) // Sort by quality, highest to lowest
}

const acceptedLanguages = [
  'ar',
  'az',
  'bg',
  'cs',
  'de',
  'en',
  'es',
  'fa',
  'fr',
  'hr',
  'hu',
  'it',
  'ja',
  'ko',
  'my',
  'nb',
  'nl',
  'pl',
  'pt',
  'ro',
  'rs',
  'rsLatin',
  'ru',
  'sv',
  'th',
  'tr',
  'ua',
  'vi',
  'zh',
  'zhTw',
]

export function matchLanguage(header: string): string | undefined {
  const parsedHeader = parseAcceptLanguage(header)

  for (const { language } of parsedHeader) {
    for (const acceptedLanguage of acceptedLanguages) {
      if (language.startsWith(acceptedLanguage)) {
        return acceptedLanguage
      }
    }
  }

  return undefined
}

const initTFunction: InitTFunction = (args) => {
  const { config, language, translations } = args
  const mergedTranslations = deepMerge(config?.translations ?? {}, translations)
  const languagePreference = matchLanguage(language)

  return {
    t: (key, vars) => {
      return t({
        key,
        translations: mergedTranslations[languagePreference],
        vars,
      })
    },
    translations: mergedTranslations,
  }
}

function memoize(fn: Function, keys: string[]) {
  const cacheMap = new Map()

  const memoized = (args) => {
    const cacheKey = keys.reduce((acc, key) => acc + args[key], '')

    if (!cacheMap.has(cacheKey)) {
      const result = fn(args)
      cacheMap.set(cacheKey, result)
    }

    return cacheMap.get(cacheKey)!
  }

  return memoized
}

export const initI18n: InitI18n = memoize(
  ({
    config,
    context,
    language = 'en',
    translations: incomingTranslations,
  }: Parameters<InitI18n>[0]) => {
    const { t, translations } = initTFunction({
      config,
      language: language || config.fallbackLanguage,
      translations: incomingTranslations,
    })

    const i18n: I18n = {
      fallbackLanguage: config.fallbackLanguage,
      language: language || config.fallbackLanguage,
      t,
      translations,
    }

    return i18n
  },
  ['language', 'context'] satisfies Array<keyof Parameters<InitI18n>[0]>,
)
