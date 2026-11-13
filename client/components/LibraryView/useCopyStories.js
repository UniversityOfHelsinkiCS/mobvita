import { useDispatch, useSelector, useStore } from 'react-redux'
import { useIntl } from 'react-intl'
import { toast } from 'react-toastify'
import { useLearningLanguage } from 'Utilities/common'
import { duplicateStories, getAllStories, setCopyInProgress } from 'Utilities/redux/storiesReducer'
import { getCopyFolderPath, getFolderPathsOfStories, getRenamedItemPath } from './folderUtils'

const RESULT_TOAST = { isLoading: false, closeOnClick: true, closeButton: true, autoClose: 5000 }

const useCopyStories = () => {
  const dispatch = useDispatch()
  const store = useStore()
  const intl = useIntl()
  const learningLanguage = useLearningLanguage()
  const copying = useSelector(({ stories }) => Boolean(stories.copyInProgress))

  // Story ids grouped by the folder their copy goes to. A folder copy keeps its sub-folders under
  // "<name> (copy)"; `shownStories` carry the paths as shown (share paths), else the store's.
  const getCopyGroups = (ids, folderPath, shownStories) => {
    if (!folderPath) return new Map([['', ids]])

    const { stories, user } = store.getState()
    const userId = user?.data?.user?.oid
    const allStories = stories.data || []
    const ownFolders = getFolderPathsOfStories(allStories.filter(story => story.user === userId))
    const targetPath = getCopyFolderPath(folderPath, ownFolders)
    const byId = new Map((shownStories || allStories).map(story => [String(story._id), story]))

    const groups = new Map()
    ids.forEach(id => {
      const original = byId.get(String(id))
      const path = original ? getRenamedItemPath(original.path, folderPath, targetPath) : targetPath
      groups.set(path, [...(groups.get(path) || []), id])
    })
    return groups
  }

  // One duplicate request per target folder; the API files every story of a request into its path.
  const duplicateIntoFolders = async groups => {
    const result = { inserted: [], failed: [], error: null }
    for (const [path, groupIds] of groups) {
      // The request middleware resolves after it has dispatched _SUCCESS / _FAILURE.
      await dispatch(duplicateStories(groupIds, path))
      const { duplicateResult, duplicateError } = store.getState().stories
      if (duplicateResult) {
        result.inserted.push(...duplicateResult.inserted)
        result.failed.push(...duplicateResult.failed)
      } else {
        result.failed.push(...groupIds)
        result.error = duplicateError
      }
    }
    return result
  }

  // Copies stories into the private library; with `folderPath`, as a "(copy)" of that folder.
  const copyStories = async (storyIds, { folderPath, stories: shownStories } = {}) => {
    const ids = (storyIds || []).filter(Boolean)
    if (!ids.length || store.getState().stories.copyInProgress) return

    dispatch(setCopyInProgress(true))
    const toastId = toast.loading(intl.formatMessage({ id: 'copying-stories' }))

    try {
      const { inserted, failed, error } = await duplicateIntoFolders(
        getCopyGroups(ids, folderPath, shownStories),
      )

      if (!inserted.length) {
        toast.update(toastId, {
          ...RESULT_TOAST,
          type: 'error',
          render:
            typeof error === 'string' ? error : intl.formatMessage({ id: 'stories-copy-failed' }),
        })
        return
      }

      // Wait for the refreshed list, so the result shows only once the copies are on screen.
      // Background refresh: the library keeps rendering instead of swapping to a spinner.
      await dispatch(
        getAllStories(learningLanguage, { sort_by: 'date', order: -1 }, { background: true }),
      )

      const partly = failed.length > 0
      toast.update(toastId, {
        ...RESULT_TOAST,
        type: partly ? 'warning' : 'success',
        render: intl.formatMessage({ id: partly ? 'stories-copy-partial' : 'stories-copied' }),
      })
    } catch {
      toast.update(toastId, {
        ...RESULT_TOAST,
        type: 'error',
        render: intl.formatMessage({ id: 'stories-copy-failed' }),
      })
    } finally {
      dispatch(setCopyInProgress(false))
    }
  }

  return { copyStories, copying }
}

export default useCopyStories
