import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { addStorySenderAsFriend } from 'Utilities/redux/userReducer'
import { acceptSharedStory } from 'Utilities/redux/storiesReducer'
import { useHistory } from 'react-router'

const AcceptStoryAddFriend = ({ queryParams }) => {
  const dispatch = useDispatch()
  const user = useSelector(({ user }) => user.data)
  const history = useHistory()

  const userId = queryParams.replace(/^.*?friend_id=(.*)&story_id=.*$/g, '$1')
  const storyId = queryParams.replace(/^.*?story_id=(.*)&token=.*$/g, '$1')
  const token = queryParams.replace(/^.*?&token=(.*)\?.*$/g, '$1')

  useEffect(() => {
    if (user) {
      history.replace('/home')
    } else {
      history.replace('/')
    }
  }, [user])

  useEffect(() => {
    dispatch(acceptSharedStory(storyId, token))
    dispatch(addStorySenderAsFriend(userId, token))
  }, [])

  return null
}

export default AcceptStoryAddFriend
