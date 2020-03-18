import { ToastContainer, toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

import React, { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { getProgress } from 'Utilities/redux/uploadProgressReducer'
import { getAllStories } from 'Utilities/redux/storiesReducer'
import { setNotification } from 'Utilities/redux/notificationReducer'
import { useIntl } from 'react-intl'
import { learningLanguageSelector } from 'Utilities/common'


export default function Toaster() {
  const dispatch = useDispatch()
  const intl = useIntl()

  const [interval, saveInterval] = useState(null)
  const [progressToastId, setProgressToastId] = useState(null)

  const { message, type, options, translationId } = useSelector(({ notification }) => notification)
  const { storyId, progress, error, processingError } = useSelector(({ uploadProgress }) => uploadProgress)
  const learningLanguage = useSelector(learningLanguageSelector)


  const handleError = (errorMessage) => {
    clearInterval(interval)
    toast.done(progressToastId)

    dispatch({ type: 'CLEAR_UPLOADPROGRESS' })
    dispatch(setNotification(errorMessage, 'error', { autoClose: false }))
    saveInterval(null)
    setProgressToastId(null)
  }

  useEffect(() => {
    if (storyId !== null) {
      const progressCheckInterval = setInterval(() => {
        dispatch(getProgress(storyId))
      }, 2000)
      saveInterval(progressCheckInterval)
    }
  }, [storyId])


  useEffect(() => {
    if (storyId !== null) {
      if (progressToastId === null) {
        setProgressToastId(toast(`Processing your story, ${Math.floor((progress * 100))}% done`, { progress, type: 'info' }))
      } else {
        toast.update(progressToastId, { progress, render: `Processing your story, ${progress * 100}% done`, type: 'info' })
      }

      if (progress === 1) {
        clearInterval(interval)
        toast.done(progressToastId)
        dispatch(
          getAllStories(learningLanguage, {
            sort_by: 'date',
            order: -1,
          }),
        )
        dispatch({ type: 'CLEAR_UPLOADPROGRESS' })
        dispatch(setNotification('The story is now ready in your private library!', 'success'))
        saveInterval(null)
        setProgressToastId(null)
      }
    }
  }, [progress])

  useEffect(() => {
    if (!processingError) return
    handleError(processingError)
  }, [processingError])

  useEffect(() => {
    if (!error) return
    handleError('Could not fetch process. Please refresh the page.')
  }, [error])

  // Handles messages that come from Redux:
  useEffect(() => {
    if (translationId) { // Used for messages that require translations.
      toast(intl.formatMessage({ id: translationId }), { type, ...options })
      dispatch({ type: 'RESET_NOTIFICATION' })
      return
    }
    if (message !== null) {
      toast(message, { type, ...options })
      dispatch({ type: 'RESET_NOTIFICATION' })
    }
  }, [message])


  return (
    <ToastContainer position={toast.POSITION.BOTTOM_CENTER} />
  )
}
