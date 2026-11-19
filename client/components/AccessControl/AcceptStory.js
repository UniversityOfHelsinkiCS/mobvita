import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { acceptSharedStory } from 'Utilities/redux/storiesReducer'
import { useNavigate } from 'react-router'
import { getEmailLinkParam } from './emailLinkParams'

// /accept_story?token=… from the share e-mail: accepts the share, then sends the user home.
const AcceptStory = ({ queryParams }) => {
  const dispatch = useDispatch()
  const user = useSelector(({ user }) => user.data)
  const navigate = useNavigate()

  const token = getEmailLinkParam(queryParams, 'token')

  useEffect(() => {
    if (user) {
      navigate('/home', { replace: true })
    } else {
      navigate('/', { replace: true })
    }
  }, [navigate, user])

  useEffect(() => {
    dispatch(acceptSharedStory(token))
  }, [dispatch, token])

  return null
}

export default AcceptStory
