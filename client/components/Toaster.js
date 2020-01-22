import { ToastContainer, toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'


import React, { useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'

export default function Toaster() {
  const message = useSelector(({ notification }) => notification.message)
  const type = useSelector(({ notification }) => notification.type)
  const dispatch = useDispatch()

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
