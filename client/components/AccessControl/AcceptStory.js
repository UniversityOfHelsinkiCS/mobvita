import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { acceptSharedStory } from 'Utilities/redux/storiesReducer'
import { useNavigate } from 'react-router-dom'

const AcceptStory = ({ queryParams }) => {
  const dispatch = useDispatch()
  const user = useSelector(({ user }) => user.data)
  const navigate = useNavigate()

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
  }, [dispatch, storyId, token])

  return null
}

export default AcceptStory
