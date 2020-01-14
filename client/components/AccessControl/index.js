import React from 'react'
import Login from 'Components/AccessControl/Login'
import { useSelector } from 'react-redux'
import LanguageSelectView from 'Components/LanguageSelectView/index'
import Register from 'Components/AccessControl/Register'

const AccessControl = ({ children }) => {
  const user = useSelector(({ user }) => user.data)

  if (!user) {
    return (
      <div>
        <Login />
        <Register />
      </div>
    )
  }

  if (!user.user.last_used_language) return <LanguageSelectView />

  return children
}

export default AccessControl
