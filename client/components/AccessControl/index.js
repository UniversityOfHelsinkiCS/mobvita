import React, { useEffect } from 'react'
import Login from 'Components/AccessControl/Login'
import { useSelector, useDispatch } from 'react-redux'
import { setLearningLanguage } from 'Utilities/redux/languageReducer'

const AccessControl = ({ children }) => {
  const { user } = useSelector(({ user }) => ({ user: user.data }))
  const dispatch = useDispatch()

  useEffect(() => {
    if (user) {
      dispatch(setLearningLanguage(user.user.last_used_language))
    }
  }, [user])

  if (!user) return <Login />


  return children
}

export default AccessControl
