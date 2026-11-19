import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { followStorySender } from 'Utilities/redux/userReducer'
import { acceptSharedStory } from 'Utilities/redux/storiesReducer'
import { useNavigate } from 'react-router'
import { getEmailLinkParam } from './emailLinkParams'

// /accept_and_add?friend_id=…&token=… : accepts the share and follows its sender.
const AcceptStoryFollowUser = ({ queryParams }) => {
  const dispatch = useDispatch()
  const user = useSelector(({ user }) => user.data)
  const navigate = useNavigate()

  const userId = getEmailLinkParam(queryParams, 'friend_id')
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
    dispatch(followStorySender(userId, token))
  }, [dispatch, token, userId])

  return null
}

export default AcceptStoryFollowUser
