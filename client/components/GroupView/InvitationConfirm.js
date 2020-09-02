import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { confirmGroupInvitation } from 'Utilities/redux/groupsReducer'
import { useHistory } from 'react-router'

const InvitationConfirm = ({ match }) => {
  const dispatch = useDispatch()
  const groups = useSelector(({ groups }) => groups)
  const history = useHistory()
  
  useEffect(() => {
    dispatch(confirmGroupInvitation(match.params.token))
    history.replace('/')
  }, [])

  return null
}

export default InvitationConfirm
