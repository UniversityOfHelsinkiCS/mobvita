import { useDispatch, useSelector, useStore } from 'react-redux'
import { useIntl } from 'react-intl'
import { toast } from 'react-toastify'
import { useLearningLanguage } from 'Utilities/common'
import {
  duplicateStories,
  getAllStories,
  setCopyInProgress,
  updateStoryPath,
} from 'Utilities/redux/storiesReducer'
import { getCopyFolderPath, getFolderPathsOfStories, getRenamedItemPath } from './folderUtils'

const RESULT_TOAST = { isLoading: false, closeOnClick: true, closeButton: true, autoClose: 5000 }

const useCopyStories = () => {
  const dispatch = useDispatch()
  const store = useStore()
  const intl = useIntl()
  const learningLanguage = useLearningLanguage()
  const copying = useSelector(({ stories }) => Boolean(stories.copyInProgress))

  const moveCopiesToNewFolder = async folderPath => {
    const { stories, user } = store.getState()
    const { succeeded = [], inserted = [] } = stories.duplicateResult || {}
    if (!inserted.length) return

    const userId = user?.data?.user?.oid
    const allStories = stories.data || []
    const ownFolders = getFolderPathsOfStories(allStories.filter(story => story.user === userId))
    const targetPath = getCopyFolderPath(folderPath, ownFolders)
    const byId = new Map(allStories.map(story => [String(story._id), story]))

    await Promise.all(
      succeeded.map((originalId, index) => {
        const original = byId.get(String(originalId))
        const copyId = inserted[index]
        if (!original || !copyId) return null
        return dispatch(
          updateStoryPath(copyId, getRenamedItemPath(original.path, folderPath, targetPath)),
        )
      }),
    )
  }

  const copyStories = async (storyIds, { folderPath } = {}) => {
    const ids = (storyIds || []).filter(Boolean)
    if (!ids.length || store.getState().stories.copyInProgress) return

    dispatch(setCopyInProgress(true))
    const toastId = toast.loading(intl.formatMessage({ id: 'copying-stories' }))

    try {
      // The request middleware resolves after it has dispatched _SUCCESS / _FAILURE.
      await dispatch(duplicateStories(ids))
      const { duplicateResult, duplicateError } = store.getState().stories

      if (!duplicateResult?.inserted?.length) {
        toast.update(toastId, {
          ...RESULT_TOAST,
          type: 'error',
          render:
            typeof duplicateError === 'string'
              ? duplicateError
              : intl.formatMessage({ id: 'stories-copy-failed' }),
        })
        return
      }

      if (folderPath) await moveCopiesToNewFolder(folderPath)
      // Wait for the refreshed list, so the result shows only once the copies are on screen.
      // Background refresh: the library keeps rendering instead of swapping to a spinner.
      await dispatch(
        getAllStories(learningLanguage, { sort_by: 'date', order: -1 }, { background: true }),
      )

      const partly = duplicateResult.failed?.length > 0
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
