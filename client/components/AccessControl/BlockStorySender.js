import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { blockStorySender } from 'Utilities/redux/userReducer'
import { useHistory } from 'react-router'

const BlockStorySender = ({ queryParams }) => {
  const dispatch = useDispatch()
  const user = useSelector(({ user }) => user.data)
  const history = useHistory()

  const userId = queryParams.replace(/^.*?friend_id=(.*)&token=.*$/g, '$1')
  const token = queryParams.replace(/^.*?&token=(.*)\?.*$/g, '$1')

  useEffect(() => {
    if (user) {
      history.replace('/home')
    } else {
      history.replace('/')
    }
  }, [user])

  useEffect(() => {
    dispatch(blockStorySender(userId, token))
  }, [])

  return null
}

export default BlockStorySender
