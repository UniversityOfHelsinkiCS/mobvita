import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { acceptSharedStory } from 'Utilities/redux/storiesReducer'
import { useHistory } from 'react-router'

const AcceptStory = ({ queryParams }) => {
  const dispatch = useDispatch()
  const user = useSelector(({ user }) => user.data)
  const history = useHistory()

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
  }, [])

  return null
}

export default AcceptStory
