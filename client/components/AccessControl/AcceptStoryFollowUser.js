import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { followStorySender } from 'Utilities/redux/userReducer'
import { acceptSharedStory } from 'Utilities/redux/storiesReducer'
import { useNavigate } from 'react-router-dom'

const AcceptStoryFollowUser = ({ queryParams }) => {
  const dispatch = useDispatch()
  const user = useSelector(({ user }) => user.data)
  const navigate = useNavigate()

  const userId = queryParams.replace(/^.*?friend_id=(.*)&story_id=.*$/g, '$1')
  const storyId = queryParams.replace(/^.*?story_id=(.*)&token=.*$/g, '$1')
  const token = queryParams.replace(/^.*?&token=(.*)\?.*$/g, '$1')

  useEffect(() => {
    if (user) {
      navigate('/home', { replace: true })
    } else {
      navigate('/', { replace: true })
    }
  }, [navigate, user])

  useEffect(() => {
    dispatch(acceptSharedStory(storyId, token))
    dispatch(followStorySender(userId, token))
  }, [dispatch, storyId, token, userId])

  return null
}

export default AcceptStoryFollowUser
