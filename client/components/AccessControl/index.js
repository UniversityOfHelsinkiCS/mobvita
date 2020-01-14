import React from 'react'
import Login from 'Components/AccessControl/Login'
import { useSelector } from 'react-redux'
import LanguageSelectView from 'Components/LanguageSelectView/index'

const AccessControl = ({ children }) => {
  const user = useSelector(({ user }) => user.data)

  if (!user) return <Login />

  if (!user.user.last_used_language) return <LanguageSelectView />

  return children
}

export default AccessControl
