import { ToastContainer, toast, Flip } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import React, { useState, useEffect, useMemo } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { getProgress } from 'Utilities/redux/uploadProgressReducer'
import { getAllStories, setStoryUploadUnfinished } from 'Utilities/redux/storiesReducer'
import { setNotification } from 'Utilities/redux/notificationReducer'
import { clearServerError } from 'Utilities/redux/serverErrorReducer'
import { updateFavouriteSites } from 'Utilities/redux/userReducer'
import { useIntl } from 'react-intl'
import { learningLanguageSelector } from 'Utilities/common'
import AchievementToast from 'Components/Achievements/AchievementToast'

export default function Toaster() {
  const dispatch = useDispatch()
  const intl = useIntl()

  const [interval, saveInterval] = useState(null)
  const [progressToastId, setProgressToastId] = useState(null)
  const [serverErrorToastId, setServerErrorToastId] = useState(null)
  const [canExercise, setCanExercise] = useState(false)

  const { pending: storiesPending } = useSelector(({ stories }) => stories)
  const { message, type, options, translationId, contextVariables } = useSelector(
    ({ notification }) => notification
  )

  const { serverError } = useSelector(({ serverError }) => serverError)
  const { newAchievements } = useSelector(({ newAchievements }) => newAchievements)
  const { storyId, progress, error, pending, processingErrorMsgId, custom, url, exerciseReady } =
    useSelector(({ uploadProgress }) => uploadProgress)
  const learningLanguage = useSelector(learningLanguageSelector)
  const favouriteSites = useSelector(({ user }) => user.data?.user?.favourite_sites)

  const handleError = errorMessage => {
    clearInterval(interval)
    toast.done(progressToastId)

    dispatch({ type: 'CLEAR_UPLOADPROGRESS' })
    dispatch(setNotification(errorMessage, 'error', { autoClose: 10000 }))
    saveInterval(null)
    setProgressToastId(null)
  }

  const isNewSite = useMemo(
    () => typeof url !== 'undefined' && !favouriteSites?.some(site => url?.includes(site.url)),
    [url, favouriteSites]
  )

  const handleNewFavouriteSite = () => {
    dispatch(updateFavouriteSites(favouriteSites.concat({ url })))
  }

  useEffect(() => {
    if (storyId !== null) {
      const progressCheckInterval = setInterval(() => {
        dispatch(getProgress(storyId))
      }, 5000)
      saveInterval(progressCheckInterval)
    }
  }, [storyId])

  useEffect(() => {
    if (pending && !storyId && !custom) {
      setProgressToastId(
        toast(intl.formatMessage({ id: 'validating-url' }), { autoClose: true, type: 'info' })
      )
    }
  }, [pending, storyId])

  useEffect(() => {
    if (storyId && progress !== 1) {
      dispatch(setStoryUploadUnfinished(true, storyId))
    }
  }, [storiesPending])

  useEffect(() => {
    if (storyId !== null) {
      if (progress !== 1 && !exerciseReady) {
        setProgressToastId(
          toast(
            `${intl.formatMessage({ id: 'processing-story' })} ${Math.floor(
              progress * 100
            )}% ${intl.formatMessage({ id: 'done' })}`,
            { type: 'info', autoClose: 10000 }
          )
        )
      }

      console.log('EX READY ', exerciseReady)
      console.log('CAN EX ', canExercise)

      if (exerciseReady && !canExercise) {
        if (processingErrorMsgId === 'no_error') {
          setCanExercise(true)
          dispatch(
            getAllStories(learningLanguage, {
              sort_by: 'date',
              order: -1,
            })
          )
          toast(
            <div>
              <span>{intl.formatMessage({ id: 'story-uploaded-successfully' })}</span>
              {isNewSite && (
                <div>
                  <b>{intl.formatMessage({ id: 'click-to-add-site-to-favourites' })}</b>
                </div>
              )}
            </div>,
            {
              type: 'success',
              autoClose: 15000,
              onClick: isNewSite ? () => handleNewFavouriteSite() : () => {},
            }
          )
        }
      }

      if (progress === 1) {
        clearInterval(interval)
        setCanExercise(false)
        saveInterval(null)
        setProgressToastId(null)
        toast.done(progressToastId)
        dispatch({ type: 'CLEAR_UPLOADPROGRESS' })
        dispatch(setStoryUploadUnfinished(false, storyId))
      }
    }
  }, [progress, exerciseReady])

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
          },
        })
      )
    }
  }, [serverError])

  // Handles achievement toast
  useEffect(() => {
    if (newAchievements) {
      newAchievements.forEach(achievement =>
        toast(<AchievementToast achievement={achievement} />, {
          transition: Flip,
          type: 'success',
          className: 'achievement-toast',
          closeButton: false,
        })
      )
    }
  }, [newAchievements])

  // Handles messages that come from Redux:
  useEffect(() => {
    if (translationId) {
      // Used for messages that require translations.

      if (contextVariables) {
        toast(intl.formatMessage({ id: translationId }, { users: contextVariables.users }), {
          type,
          ...options,
        })
      } else {
        toast(intl.formatMessage({ id: translationId }), { type, ...options })
      }

      dispatch({ type: 'RESET_NOTIFICATION' })
      return
    }
    if (message !== null && message !== undefined) {
      toast(message, { type, ...options })
      dispatch({ type: 'RESET_NOTIFICATION' })
    }
  }, [message])

  return <ToastContainer position={toast.POSITION.BOTTOM_CENTER} />
}
