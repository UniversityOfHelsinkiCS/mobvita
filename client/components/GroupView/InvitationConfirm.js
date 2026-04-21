import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { confirmGroupInvitation } from 'Utilities/redux/groupsReducer'
import { useParams } from 'react-router-dom'

const InvitationConfirm = () => {
  const dispatch = useDispatch()
  const groups = useSelector(({ groups }) => groups)
  const navigate = useNavigate()
  const { token } = useParams()
  
  useEffect(() => {
    dispatch(confirmGroupInvitation(token))
    navigate('/', { replace: true })
  }, [dispatch, navigate, token])

  return null
}

export default InvitationConfirm
