import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { confirmUser } from 'Utilities/redux/userReducer'
import { useParams, useNavigate } from 'react-router-dom'

const EmailConfirm = () => {
  const dispatch = useDispatch()
  const user = useSelector(({ user }) => user.data)
  const navigate = useNavigate()
  const { token } = useParams()

  useEffect(() => {
    if (user) {
      navigate('/home', { replace: true })
    }
  }, [navigate, user])


  useEffect(() => {
    dispatch(confirmUser(token))
  }, [dispatch, token])

  return null
}

export default EmailConfirm
