import React, { useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { confirmGroupInvitation } from 'Utilities/redux/groupsReducer'
import { useParams, useNavigate } from 'react-router'
import Spinner from 'Components/Spinner'
import { colors } from 'Assets/mui_theme/designTokens'
import useOpenJoinedGroup from './useOpenJoinedGroup'

// Landing page of the invitation e-mail link (/group-confirmation/:token). Accepts the invitation,
// then opens the joined group's library; a failed confirmation goes home as before. `replace`, so
// Back does not return to the one-off link.
const InvitationConfirm = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { token } = useParams()
  const expectJoin = useOpenJoinedGroup({
    replace: true,
    onFailure: () => navigate('/', { replace: true }),
  })

  useEffect(() => {
    expectJoin()
    dispatch(confirmGroupInvitation(token))
  }, [token])

  return <Spinner fullHeight spinnerColor={colors.ink} size={60} />
}

export default InvitationConfirm
