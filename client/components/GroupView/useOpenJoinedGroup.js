import { useEffect, useRef } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router'
import { saveSelfIntermediate, updateGroupSelect } from 'Utilities/redux/userReducer'

/**
 * After a student joins a group — with a group token or from an invitation e-mail link — open the
 * group library (/library, Group tab) on the group just joined.
 *
 * Returns `expectJoin`: call it right before dispatching the join, so only a join this component
 * started redirects. It waits for the server's answer (JOIN_GROUP_SUCCESS / _FAILURE) instead of
 * navigating straight away, so a wrong token never lands the student in the library.
 *
 *   onFailure – called when the join fails (the error toast is shown by the notification reducer)
 *   replace   – replace the current history entry (e.g. the one-off invitation link)
 */
const useOpenJoinedGroup = ({ onFailure, replace = false } = {}) => {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { joinPending, joinedGroupId, joinFailed } = useSelector(({ groups }) => groups)
  const expecting = useRef(false)

  useEffect(() => {
    if (!expecting.current || joinPending) return
    if (!joinedGroupId && !joinFailed) return
    expecting.current = false

    if (joinedGroupId) {
      // Locally first, so the library opens on this group without waiting for the save.
      dispatch(saveSelfIntermediate({ last_selected_group: joinedGroupId }))
      dispatch(updateGroupSelect(joinedGroupId))
      // One-off request read by LibraryView: opens the Group tab.
      navigate('/library', { replace, state: { library: 'group' } })
    } else if (onFailure) {
      onFailure()
    }
  }, [joinPending, joinedGroupId, joinFailed])

  return () => {
    expecting.current = true
  }
}

export default useOpenJoinedGroup
