import * as fs from 'fs'
import * as path from 'path'
import { fileURLToPath } from 'url'
import { ensureDirectoryExists } from './src/utilities/ensureDirExists.js'
import { copyFile } from './src/utilities/copyFile.js'
import { translations } from './src/all/index.js'
import { exec } from 'child_process'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

const serverTranslationKeys = [
  'authentication:account',
  'authentication:api',
  'authentication:apiKey',
  'authentication:enableAPIKey',
  'authentication:newAccountCreated',
  'authentication:resetYourPassword',
  'authentication:verifyYourEmail',
  'authentication:youAreReceivingResetPassword',
  'authentication:youDidNotRequestPassword',
  'authentication:verified',

  'fields:textToDisplay',
  'fields:linkType',
  'fields:chooseBetweenCustomTextOrDocument',
  'fields:customURL',
  'fields:internalLink',
  'fields:enterURL',
  'fields:chooseDocumentToLink',
  'fields:openInNewTab',

  'general:createdAt',
  'general:deletedCountSuccessfully',
  'general:deletedSuccessfully',
  'general:email',
  'general:notFound',
  'general:successfullyCreated',
  'general:successfullyDuplicated',
  'general:thisLanguage',
  'general:user',
  'general:users',
  'general:updatedAt',
  'general:updatedSuccessfully',
  'general:updatedCountSuccessfully',
  'general:value',

  'error:deletingFile',
  'error:emailOrPasswordIncorrect',
  'error:followingFieldsInvalid',
  'error:noFilesUploaded',
  'error:notAllowedToPerformAction',
  'error:problemUploadingFile',
  'error:unableToDeleteCount',
  'error:unableToUpdateCount',
  'error:unauthorized',
  'error:userLocked',
  'error:valueMustBeUnique',

  'upload:width',
  'upload:height',
  'upload:fileSize',
  'upload:fileName',
  'upload:sizes',

  'validation:emailAddress',
  'validation:enterNumber',
  'validation:greaterThanMax',
  'validation:invalidInput',
  'validation:invalidSelection',
  'validation:invalidSelections',
  'validation:lessThanMin',
  'validation:longerThanMin',
  'validation:notValidDate',
  'validation:required',
  'validation:requiresNoMoreThan',
  'validation:requiresTwoNumbers',
  'validation:shorterThanMax',
  'validation:trueOrFalse',
  'validation:validUploadID',

  'version:autosavedSuccessfully',
  'version:draftSavedSuccessfully',
  'version:restoredSuccessfully',
  'version:draft',
  'version:published',
  'version:status',
]

const clientTranslationKeys = [
  'authentication:account',
  'authentication:accountOfCurrentUser',
  'authentication:alreadyActivated',
  'authentication:alreadyLoggedIn',
  'authentication:backToLogin',
  'authentication:beginCreateFirstUser',
  'authentication:changePassword',
  'authentication:confirmGeneration',
  'authentication:confirmPassword',
  'authentication:createFirstUser',
  'authentication:emailNotValid',
  'authentication:emailSent',
  'authentication:enableAPIKey',
  'authentication:failedToUnlock',
  'authentication:forceUnlock',
  'authentication:forgotPassword',
  'authentication:forgotPasswordEmailInstructions',
  'authentication:forgotPasswordQuestion',
  'authentication:generate',
  'authentication:generateNewAPIKey',
  'authentication:logBackIn',
  'authentication:loggedOutInactivity',
  'authentication:loggedOutSuccessfully',
  'authentication:login',
  'authentication:logOut',
  'authentication:logout',
  'authentication:logoutUser',
  'authentication:newAPIKeyGenerated',
  'authentication:newPassword',
  'authentication:resetPassword',
  'authentication:stayLoggedIn',
  'authentication:successfullyUnlocked',
  'authentication:unableToVerify',
  'authentication:verified',
  'authentication:verifiedSuccessfully',
  'authentication:verify',
  'authentication:verifyUser',
  'authentication:youAreInactive',

  'error:autosaving',
  'error:correctInvalidFields',
  'error:deletingTitle',
  'error:loadingDocument',
  'error:noMatchedField',
  'error:notAllowedToAccessPage',
  'error:previewing',
  'error:unableToDeleteCount',
  'error:unableToUpdateCount',
  'error:unauthorized',
  'error:unknown',
  'error:unspecific',

  'fields:addLabel',
  'fields:addLink',
  'fields:addNew',
  'fields:addNewLabel',
  'fields:addRelationship',
  'fields:addUpload',
  'fields:block',
  'fields:blocks',
  'fields:blockType',
  'fields:chooseFromExisting',
  'fields:collapseAll',
  'fields:editLink',
  'fields:editRelationship',
  'fields:itemsAndMore',
  'fields:labelRelationship',
  'fields:latitude',
  'fields:longitude',
  'fields:passwordsDoNotMatch',
  'fields:removeRelationship',
  'fields:removeUpload',
  'fields:saveChanges',
  'fields:searchForBlock',
  'fields:selectFieldsToEdit',
  'fields:showAll',
  'fields:swapRelationship',
  'fields:swapUpload',
  'fields:toggleBlock',
  'fields:uploadNewLabel',

  'general:aboutToDeleteCount',
  'general:aboutToDelete',
  'general:addBelow',
  'general:addFilter',
  'general:adminTheme',
  'general:and',
  'general:applyChanges',
  'general:ascending',
  'general:automatic',
  'general:backToDashboard',
  'general:cancel',
  'general:changesNotSaved',
  'general:close',
  'general:collapse',
  'general:collections',
  'general:columns',
  'general:columnToSort',
  'general:confirm',
  'general:confirmDeletion',
  'general:confirmDuplication',
  'general:copied',
  'general:copy',
  'general:create',
  'general:created',
  'general:createNew',
  'general:createNewLabel',
  'general:creating',
  'general:creatingNewLabel',
  'general:dark',
  'general:dashboard',
  'general:delete',
  'general:deletedCountSuccessfully',
  'general:deleting',
  'general:descending',
  'general:deselectAllRows',
  'general:duplicate',
  'general:duplicateWithoutSaving',
  'general:edit',
  'general:editing',
  'general:editingLabel',
  'general:editLabel',
  'general:email',
  'general:emailAddress',
  'general:enterAValue',
  'general:error',
  'general:errors',
  'general:fallbackToDefaultLocale',
  'general:filters',
  'general:filterWhere',
  'general:globals',
  'general:language',
  'general:lastModified',
  'general:lastSavedAgo',
  'general:leaveAnyway',
  'general:leaveWithoutSaving',
  'general:light',
  'general:livePreview',
  'general:loading',
  'general:locale',
  'general:menu',
  'general:moveDown',
  'general:moveUp',
  'general:noFiltersSet',
  'general:noLabel',
  'general:none',
  'general:noOptions',
  'general:noResults',
  'general:notFound',
  'general:nothingFound',
  'general:noValue',
  'general:of',
  'general:open',
  'general:or',
  'general:order',
  'general:pageNotFound',
  'general:password',
  'general:payloadSettings',
  'general:perPage',
  'general:remove',
  'general:reset',
  'general:row',
  'general:rows',
  'general:save',
  'general:saving',
  'general:searchBy',
  'general:selectAll',
  'general:selectAllRows',
  'general:selectedCount',
  'general:selectValue',
  'general:showAllLabel',
  'general:sorryNotFound',
  'general:sort',
  'general:sortByLabelDirection',
  'general:stayOnThisPage',
  'general:submissionSuccessful',
  'general:submit',
  'general:successfullyCreated',
  'general:successfullyDeleted',
  'general:thisLanguage',
  'general:titleDeleted',
  'general:unauthorized',
  'general:unsavedChangesDuplicate',
  'general:untitled',
  'general:updatedAt',
  'general:updatedCountSuccessfully',
  'general:updatedSuccessfully',
  'general:updating',
  'general:welcome',

  'operators:equals',
  'operators:exists',
  'operators:isNotIn',
  'operators:isIn',
  'operators:contains',
  'operators:isLike',
  'operators:isNotEqualTo',
  'operators:near',
  'operators:isGreaterThan',
  'operators:isLessThan',
  'operators:isGreaterThanOrEqualTo',
  'operators:isLessThanOrEqualTo',

  'upload:crop',
  'upload:cropToolDescription',
  'upload:dragAndDrop',
  'upload:editImage',
  'upload:focalPoint',
  'upload:focalPointDescription',
  'upload:height',
  'upload:previewSizes',
  'upload:selectCollectionToBrowse',
  'upload:selectFile',
  'upload:setCropArea',
  'upload:setFocalPoint',
  'upload:sizesFor',
  'upload:width',

  'validation:fieldHasNo',
  'validation:limitReached',
  'validation:required',
  'validation:requiresAtLeast',

  'version:aboutToPublishSelection',
  'version:aboutToRestore',
  'version:aboutToRestoreGlobal',
  'version:aboutToRevertToPublished',
  'version:aboutToUnpublish',
  'version:aboutToUnpublishSelection',
  'version:autosave',
  'version:autosavedSuccessfully',
  'version:changed',
  'version:confirmRevertToSaved',
  'version:compareVersion',
  'version:confirmPublish',
  'version:confirmUnpublish',
  'version:confirmVersionRestoration',
  'version:draft',
  'version:draftSavedSuccessfully',
  'version:noFurtherVersionsFound',
  'version:noRowsFound',
  'version:preview',
  'version:problemRestoringVersion',
  'version:publish',
  'version:publishChanges',
  'version:published',
  'version:publishing',
  'version:restoredSuccessfully',
  'version:restoreThisVersion',
  'version:restoring',
  'version:revertToPublished',
  'version:saveDraft',
  'version:selectLocales',
  'version:selectVersionToCompare',
  'version:showLocales',
  'version:type',
  'version:unpublish',
  'version:unpublishing',
  'version:versionCreatedOn',
  'version:versionID',
  'version:version',
  'version:versions',
  'version:viewingVersion',
  'version:viewingVersionGlobal',
  'version:viewingVersions',
  'version:viewingVersionsGlobal',
]

const DESTINATION_ROOT = './src/_generatedFiles_'
const SOURCE_DIR = './src/all'

function filterKeys(obj, parentGroupKey = '', keys) {
  const result = {}

  for (const [namespaceKey, value] of Object.entries(obj)) {
    // Skip $schema key
    if (namespaceKey === '$schema') {
      result[namespaceKey] = value
      continue
    }

    if (typeof value === 'object') {
      const filteredObject = filterKeys(value, namespaceKey, keys)
      if (Object.keys(filteredObject).length > 0) {
        result[namespaceKey] = filteredObject
      }
    } else {
      for (const key of keys) {
        const [groupKey, selector] = key.split(':')

        if (parentGroupKey === groupKey) {
          if (namespaceKey === selector) {
            result[selector] = value
          } else {
            const pluralKeys = ['zero', 'one', 'two', 'few', 'many', 'other']
            pluralKeys.forEach((pluralKey) => {
              if (namespaceKey === `${selector}_${pluralKey}`) {
                result[`${selector}_${pluralKey}`] = value
              }
            })
          }
        }
      }
    }
  }

  return result
}

function sortObject(obj) {
  const sortedObject = {}
  Object.keys(obj)
    .sort()
    .forEach((key) => {
      if (typeof obj[key] === 'object') {
        sortedObject[key] = sortObject(obj[key])
      } else {
        sortedObject[key] = obj[key]
      }
    })
  return sortedObject
}

async function build() {
  ensureDirectoryExists(path.resolve(dirname, `${DESTINATION_ROOT}/client`))
  ensureDirectoryExists(path.resolve(dirname, `${DESTINATION_ROOT}/api`))

  // build up the client and server translation files
  for (const [locale, values] of Object.entries(translations)) {
    const dest1 = path.resolve(dirname, `${DESTINATION_ROOT}/client/${locale}.js`)

    const clientTranslations = sortObject(filterKeys(values, '', clientTranslationKeys))

    fs.writeFileSync(dest1, 'export default ' + JSON.stringify(clientTranslations, null, 2), {
      flag: 'w+',
    })

    const serverTranslations = sortObject(filterKeys(values, '', serverTranslationKeys))
    const dest2 = path.resolve(dirname, `${DESTINATION_ROOT}/api/${locale}.js`)

    fs.writeFileSync(dest2, 'export default ' + JSON.stringify(serverTranslations, null, 2), {
      flag: 'w+',
    })

    console.info('Rebuilt:', filename)
  }

  // copy barrel file to both client and api folders
  copyFile(
    path.resolve(dirname, `${SOURCE_DIR}/index.ts`),
    path.resolve(dirname, `${DESTINATION_ROOT}/api/index.ts`),
  )
  copyFile(
    path.resolve(dirname, `${SOURCE_DIR}/index.ts`),
    path.resolve(dirname, `${DESTINATION_ROOT}/client/index.ts`),
  )

  // Run prettier from CLI so that files pass the pre-commit hook:
  console.info('Running prettier...')
  exec('prettier --write "**/*.js"', (err, stdout, stderr) => {
    if (err) {
      console.error(err)
      return
    }
    console.info(stdout)
  })
}

build()
  .then(() => {
    console.log('Built client and api translation files.')
  })
  .catch((error) => {
    console.error('Error occurred:', error)
  })
