import React from 'react'
import Login from 'Components/AccessControl/Login'
import { useSelector } from 'react-redux'

const AccessControl = ({ children }) => {
  const { user } = useSelector(({ user }) => ({ user: user.data }))

  if (!user) return <Login />

  return children
}

export default AccessControl
