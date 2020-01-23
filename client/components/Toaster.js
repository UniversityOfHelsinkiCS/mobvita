import { ToastContainer, toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

import React, { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { getProgress } from 'Utilities/redux/uploadProgressReducer'
import { getStories } from 'Utilities/redux/storiesReducer'
import { setNotification } from 'Utilities/redux/notificationReducer'


export default function Toaster() {
  const message = useSelector(({ notification }) => notification.message)
  const type = useSelector(({ notification }) => notification.type)
  const dispatch = useDispatch()
  const { storyId, progress } = useSelector(({ uploadProgress }) => uploadProgress)
  const [interval, saveInterval] = useState(null)

  const user = useSelector(({ user }) => user)


  const [progressToastId, setProgressToastId] = useState(null)

  // TODO: Refactor story upload processing to somewhere else...
  // Must be in some global component for updates to propagate to the currect toast-instance

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
        setProgressToastId(toast(`Processing your story, ${progress * 100}% done`, { progress, type: 'info' }))
      } else {
        toast.update(progressToastId, { progress, render: `Processing your story, ${progress * 100}% done`, type: 'info' })
      }

      if (progress === 1) {
        clearInterval(interval)
        toast.done(progressToastId)
        dispatch(getStories(user.data.user.last_used_language, {
          sort_by: 'date',
          order: -1,
          page: 0,
          page_size: 20,
        }))
        dispatch({ type: 'CLEAR_UPLOADPROGRESS' })
        dispatch(setNotification('The story is now ready in your library!', 'success'))
        saveInterval(null)
        setProgressToastId(null)
      }
    }
  }, [progress])


  // Handles messages that come from Redux:
  useEffect(() => {
    if (message !== null) {
      toast(message, { type })
      dispatch({ type: 'RESET_NOTIFICATION' })
    }
  }, [message])


  return (
    <ToastContainer position={toast.POSITION.BOTTOM_CENTER} />
  )
}
