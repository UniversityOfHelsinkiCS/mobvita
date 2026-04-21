import { ToastContainer, toast, Flip } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import React, { useState, useEffect, useMemo, useRef } from 'react'
import { useLocation } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { getProgress } from 'Utilities/redux/uploadProgressReducer'
import { getAllStories, setStoryUploadUnfinished } from 'Utilities/redux/storiesReducer'
import { setNotification } from 'Utilities/redux/notificationReducer'
import { clearServerError, setServerError } from 'Utilities/redux/serverErrorReducer'
import { updateLibrarySelect } from 'Utilities/redux/userReducer'
import { useIntl, FormattedHTMLMessage } from 'react-intl'
import { learningLanguageSelector } from 'Utilities/common'
import AchievementToast from 'Components/Achievements/AchievementToast'
import StreakToast from 'Components/Streak/StreakToast'
import LevelUpToast from './LevelUpToast'

export default function Toaster() {
  const dispatch = useDispatch()
  const intl = useIntl()
  const navigate = useNavigate()
  const [interval, saveInterval] = useState(null)
  const [progressToastId, setProgressToastId] = useState(null)
  const [serverErrorToastId, setServerErrorToastId] = useState(null)
  const [canExercise, setCanExercise] = useState(false)
  const [navigatedToPreviewStoryId, setNavigatedToPreviewStoryId] = useState(null)
  const controlledPractice = useSelector(({ controlledPractice }) => controlledPractice)
  const { pending: storiesPending } = useSelector(({ stories }) => stories)
  const { message, type, options, translationId, contextVariables } = useSelector(
    ({ notification }) => notification
  )

  const { serverError } = useSelector(({ serverError }) => serverError)
  const { newAchievements } = useSelector(({ newAchievements }) => newAchievements)
  const {
    storyId,
    progress,
    error,
    pending,
    processingErrorMsgId,
    custom,
    exerciseReady } = useSelector(({ uploadProgress }) => uploadProgress)
  const learningLanguage = useSelector(learningLanguageSelector)

  const handleError = errorMessage => {
    clearInterval(interval)

    navigate('/library')
    dispatch(updateLibrarySelect('private'))
    dispatch({ type: 'CLEAR_UPLOADPROGRESS' })
    dispatch(setNotification(errorMessage, 'error', { autoClose: 10000 }))
    saveInterval(null)
    setNavigatedToPreviewStoryId(null)
    setProgressToastId(null)
  }

  const { streak } = useSelector((state) => state.streak);
  const prevStreakRef = useRef(null); 

  useEffect(() => {
    // Trigger toast if transition is from 'not_streaked' to 'streaked'
    if (prevStreakRef.current === 'not_streaked' && streak === 'streaked') {
      toast(<StreakToast />, {
        transition: Flip,
        type: 'warning',
        className: 'streak-toast',
        position: 'top-center',
        closeButton: false });
    }
    prevStreakRef.current = streak;
  }, [streak]);

  const { levelUp } = useSelector(state => state.levelUp)

  useEffect(() => {
    if (levelUp) {
      toast(<LevelUpToast />, {
        transition: Flip,
        type: 'warning',
        className: 'level-up-toast',
        position: 'top-center',
        closeButton: false })
    }
  }, [levelUp])

  useEffect(() => {
    if (controlledPractice.finished) {
      setProgressToastId(
        toast(intl.formatMessage({ id: 'controlled-story-saved' }), {
          autoClose: 8000,
          type: 'success' })
      )
    }
  }, [controlledPractice?.finished])

  useEffect(() => {
    if (storyId !== null && progress !== 1) {
      if (storyId !== navigatedToPreviewStoryId) {
        navigate(`/stories/${storyId}/preview/`)
        setNavigatedToPreviewStoryId(storyId)
      }

      const progressCheckInterval = setInterval(() => {
        dispatch(getProgress(storyId))
      }, 5000)
      saveInterval(progressCheckInterval)
    }
    else if (storyId !== null && progress === 1) {
      dispatch(
        getAllStories(learningLanguage, {
          sort_by: 'date',
          order: -1 })
      )
    }
  }, [storyId])

  useEffect(() => {
    if (storyId && progress !== 1) {
      dispatch(setStoryUploadUnfinished(true, storyId))
    }
  }, [storiesPending])

  useEffect(() => {
    if (storyId !== null) {
      if (progress !== 1 && progress > 0 && !exerciseReady && !pending) {
        // Intentionally silent during processing; preview view should be shown instead.
      }

      if (exerciseReady && !canExercise) {
        if (processingErrorMsgId === 'no_error') {
          setCanExercise(true)
          dispatch(
            getAllStories(learningLanguage, {
              sort_by: 'date',
              order: -1 })
          )
        }
      }

      if (progress === 1) {
        clearInterval(interval)
        setCanExercise(false)
        saveInterval(null)
        setNavigatedToPreviewStoryId(null)
        setProgressToastId(null)
        dispatch({ type: 'CLEAR_UPLOADPROGRESS' })
        dispatch(setStoryUploadUnfinished(false, storyId))
      }
    }
  }, [exerciseReady, pending, progress, storyId, history, dispatch, learningLanguage, navigatedToPreviewStoryId])

  useEffect(() => {
    if (processingErrorMsgId === 'no_error' && !error) return
    if (processingErrorMsgId) {
      handleError(processingErrorMsgId)
    } else {
      toast.dismiss(progressToastId)
      setProgressToastId(null)
    }
  }, [processingErrorMsgId, error])

  // Handles server error toast
  useEffect(() => {
    if (serverError && !serverErrorToastId) {
      setServerErrorToastId(
        toast(intl.formatMessage({ id: 'server-issues' }), {
          type: 'error',
          autoClose: false,
          onClose: () => {
            dispatch(clearServerError())
            setServerErrorToastId(null)
          } })
      )
    }
  }, [serverError])

  // Handles achievement toast
  useEffect(() => {
    if (newAchievements) {
      newAchievements.forEach(achievement =>
        toast(<AchievementToast achievement={achievement} />, {
          transition: Flip,
          type: 'warning',
          className: 'achievement-toast',
          position: 'top-center',
          closeButton: false })
      )
    }
  }, [newAchievements])

  // Handles messages that come from Redux:
  useEffect(() => {
    if (translationId) {
      // Used for messages that require translations.

      if (contextVariables) {
        toast(<FormattedHTMLMessage id={translationId} values={{ users: contextVariables.users }} />, {
          type,
          ...options })
      } else {
        toast(<FormattedHTMLMessage id={translationId} />, { type, ...options })
      }

      dispatch({ type: 'RESET_NOTIFICATION' })
      return
    }
    if (message !== null && message !== undefined) {
      toast(message, { type, ...options })
      dispatch({ type: 'RESET_NOTIFICATION' })
    }
  }, [message])

  return (
    <ToastContainer
      position={serverError && !serverErrorToastId ? 'top-center' : 'bottom-center'}
    />
  )
}
