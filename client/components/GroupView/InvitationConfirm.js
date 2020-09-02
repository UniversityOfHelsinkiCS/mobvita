import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { confirmGroupInvitation } from 'Utilities/redux/groupsReducer'
import { useHistory } from 'react-router'

const InvitationConfirm = ({ match }) => {
  const dispatch = useDispatch()
  const groups = useSelector(({ groups }) => groups)
  const history = useHistory()

  useEffect(() => {
    if (groups) {
      history.replace('/home')
    }
  }, [groups])


  useEffect(() => {
    dispatch(confirmGroupInvitation(match.params.token))
  }, [])

  return null
}

export default InvitationConfirm
