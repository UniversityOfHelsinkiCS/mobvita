import { ToastContainer, toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'


import React from 'react'

export default function Toaster() {
  return (
    <ToastContainer position={toast.POSITION.BOTTOM_CENTER} />
  )
}
