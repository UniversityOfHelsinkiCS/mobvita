import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { confirmUser } from 'Utilities/redux/userReducer'
import { useHistory } from 'react-router'

const EmailConfirm = ({ match }) => {
  const dispatch = useDispatch()
  const user = useSelector(({ user }) => user.data)
  const history = useHistory()

  useEffect(() => {
    if (user) {
      history.replace('/home')
    }
  }, [user])


  useEffect(() => {
    dispatch(confirmUser(match.params.token))
  }, [])

  return null
}

export default EmailConfirm
