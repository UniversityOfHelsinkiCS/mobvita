import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { blockStorySender } from 'Utilities/redux/userReducer'
import { useNavigate } from 'react-router-dom'

const BlockStorySender = ({ queryParams }) => {
  const dispatch = useDispatch()
  const user = useSelector(({ user }) => user.data)
  const navigate = useNavigate()

  const userId = queryParams.replace(/^.*?friend_id=(.*)&token=.*$/g, '$1')
  const token = queryParams.replace(/^.*?&token=(.*)\?.*$/g, '$1')

  useEffect(() => {
    if (user) {
      navigate('/home', { replace: true })
    } else {
      navigate('/', { replace: true })
    }
  }, [navigate, user])

  useEffect(() => {
    dispatch(blockStorySender(userId, token))
  }, [dispatch, token, userId])

  return null
}

export default BlockStorySender
