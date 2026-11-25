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

  // Story id → folder of its copy: a folder copy keeps its sub-folders under "<name> (copy)";
  // `shownStories` carry the paths as shown (share paths). Single copies: {} = top level.
  const getCopyPathDict = (ids, folderPath, shownStories) => {
    if (!folderPath) return {}

    const { stories, user } = store.getState()
    const userId = user?.data?.user?.oid
    const allStories = stories.data || []
    const ownFolders = getFolderPathsOfStories(allStories.filter(story => story.user === userId))
    const targetPath = getCopyFolderPath(folderPath, ownFolders)
    const byId = new Map((shownStories || allStories).map(story => [String(story._id), story]))

    return Object.fromEntries(
      ids.map(id => {
        const original = byId.get(String(id))
        const path = original
          ? getRenamedItemPath(original.path, folderPath, targetPath)
          : targetPath
        return [id, path]
      }),
    )
  }

  // One duplicate request for all ids; each copy goes into its `path_dict` folder.
  const duplicateWithPaths = async (ids, pathDict) => {
    // The request middleware resolves after it has dispatched _SUCCESS / _FAILURE.
    await dispatch(duplicateStories(ids, pathDict))
    const { duplicateResult, duplicateError } = store.getState().stories
    if (duplicateResult) {
      return { inserted: duplicateResult.inserted, failed: duplicateResult.failed, error: null }
    }
    return { inserted: [], failed: ids, error: duplicateError }
  }

  // Copies stories into the private library; with `folderPath`, as a "(copy)" of that folder.
  const copyStories = async (storyIds, { folderPath, stories: shownStories } = {}) => {
    const ids = (storyIds || []).filter(Boolean)
    if (!ids.length || store.getState().stories.copyInProgress) return

    dispatch(setCopyInProgress(true))
    const toastId = toast.loading(intl.formatMessage({ id: 'copying-stories' }))

    try {
      const { inserted, failed, error } = await duplicateWithPaths(
        ids,
        getCopyPathDict(ids, folderPath, shownStories),
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
