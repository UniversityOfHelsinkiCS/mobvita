import React, { useEffect } from 'react'
import Login from 'Components/AccessControl/Login'
import { useSelector, useDispatch } from 'react-redux'
import LearningLanguageSelectView from 'Components/LanguageSelectView/index'
import Register from 'Components/AccessControl/Register'
import { getSelf } from 'Utilities/redux/userReducer'

const AccessControl = ({ children }) => {
  const dispatch = useDispatch()

  useEffect(() => {
    dispatch(getSelf())
  }, [])

  return children
}

export default AccessControl
