import { ToastContainer, toast, Flip } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import React, { useState, useEffect, useMemo } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { getProgress } from 'Utilities/redux/uploadProgressReducer'
import { getAllStories } from 'Utilities/redux/storiesReducer'
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

  const { message, type, options, translationId } = useSelector(({ notification }) => notification)
  const { serverError } = useSelector(({ serverError }) => serverError)
  const { newAchievements } = useSelector(({ newAchievements }) => newAchievements)
  const { storyId, progress, error, pending, processingError, custom, url } = useSelector(
    ({ uploadProgress }) => uploadProgress
  )
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

  const isNewSite = useMemo(() =>  typeof url !== 'undefined' && !favouriteSites?.some(site => url?.includes(site.url)), [
    url,
    favouriteSites,
  ])

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
        toast(intl.formatMessage({ id: 'validating-url' }), { autoClose: false, type: 'info' })
      )
    }
  }, [pending, storyId])

  useEffect(() => {
    if (storyId !== null) {
      if (progressToastId === null) {
        setProgressToastId(
          toast(
            `${intl.formatMessage({ id: 'processing-story' })}, ${Math.floor(
              progress * 100
            )}% ${intl.formatMessage({ id: 'done' })}`,
            { progress, type: 'info' }
          )
        )
      } else {
        toast.update(progressToastId, {
          progress,
          render: `${intl.formatMessage({ id: 'processing-story' })}, ${
            progress * 100
          }% ${intl.formatMessage({ id: 'done' })}`,
          type: 'info',
        })
      }

      if (progress === 1) {
        clearInterval(interval)
        toast.done(progressToastId)
        if (!processingError) {
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
                  <b>{intl.formatMessage({ id: 'Click here to add site to your favourites.' })}</b>
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

        dispatch({ type: 'CLEAR_UPLOADPROGRESS' })
        saveInterval(null)
        setProgressToastId(null)
      }
    }
  }, [progress])

  useEffect(() => {
    if (!processingError && !error) return
    if (processingError) {
      handleError(processingError)
    } else {
      toast.dismiss(progressToastId)
      setProgressToastId(null)
    }
  }, [processingError, error])

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
      toast(intl.formatMessage({ id: translationId }), { type, ...options })
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
