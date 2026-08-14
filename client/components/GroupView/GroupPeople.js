// eslint-disable-next-line no-unused-vars
import React, { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import {
  removeFromGroup,
  resendGroupInvitation,
  setGroupTestDeadline,
} from 'Utilities/redux/groupsReducer'
import { FormattedMessage } from 'react-intl'
import { Box, TableHead, TableBody, TableRow, TableCell, IconButton } from '@mui/material'
import AddIcon from '@mui/icons-material/Add'
import CloseIcon from '@mui/icons-material/Close'
import AppButton from 'Components/AppButton'
import AppTable from 'Components/ui/AppTable'
import { colors, font } from 'Assets/mui_theme/designTokens'
import Spinner from 'Components/Spinner'
import NoGroupsView from './NoGroupsView'
import AddToGroup from './AddToGroup'
import PeopleAddResultModal from './PeopleAddResultModal'
import GroupFunctions from './GroupFunctions'
import GroupKey from './GroupKey'
import EnableTestMenu from './EnableTestMenu'

const ADD_GREEN = '#2E9E6E'

const GroupPeople = ({ role }) => {
  const currentGroupId = useSelector(({ user }) => user.data.user.last_selected_group)
  const dispatch = useDispatch()

  const [addToGroupId, setAddToGroupId] = useState(null)
  const { groups: totalGroups, lastAddInfo, pending } = useSelector(({ groups }) => groups)
  const currentGroup = totalGroups.find(group => group.group_id === currentGroupId)
  const [showTokenGroupId, setShowTokenGroupId] = useState(null)

  const [showTestEnableMenuGroupId, setShowTestEnableMenuGroupId] = useState(null)

  const [currTestDeadline, setCurrTestDeadline] = useState(currentGroup?.test_deadline)
  const showToken = showTokenGroupId === currentGroupId
  const showTestEnableMenu = showTestEnableMenuGroupId === currentGroupId
  const compare = (a, b) => {
    if (a.userName.toLowerCase() < b.userName.toLowerCase()) return -1
    if (a.userName.toLowerCase() > b.userName.toLowerCase()) return 1
    return 0
  }

  if (currentGroup) {
    currentGroup.teachers.sort(compare)
    currentGroup.students.sort(compare)
  }

  const removeUser = (userId, userRole) => {
    dispatch(removeFromGroup(currentGroupId, userId, userRole))
  }

  const handleResendInvitationClick = userId => {
    dispatch(resendGroupInvitation(currentGroupId, userId))
  }

  if (pending || (totalGroups.length > 0 && !currentGroup)) return <Spinner fullHeight size={60} />

  if (totalGroups.length === 0) {
    return <NoGroupsView role={role} />
  }

  const currentUserIsTeacher = currentGroup.is_teaching

  return (
    <div className="group-container">
      <Box
        sx={{
          backgroundColor: colors.card,
          color: colors.ink,
          fontFamily: font.family,
          border: `1px solid ${colors.border}`,
          borderRadius: '20px',
          width: '100%',
          maxWidth: 1024,
          mx: 'auto',
          my: '2rem',
          p: { xs: '16px', sm: '24px' },
        }}
      >
        <PeopleAddResultModal lastAddInfo={lastAddInfo} />

        <div style={{ marginBottom: '.75em' }}>
          <div className="header-2">{currentGroup.groupName}</div>
          <p style={{ paddingLeft: '0.2rem', fontStyle: 'italic' }}>{currentGroup?.description}</p>
        </div>
        <GroupFunctions
          group={currentGroup}
          showToken={showToken}
          setShowTokenGroupId={setShowTokenGroupId}
          showTestEnableMenuGroupId={showTestEnableMenuGroupId}
          setShowTestEnableMenuGroupId={setShowTestEnableMenuGroupId}
          currTestDeadline={currTestDeadline}
          setCurrTestDeadline={setCurrTestDeadline}
        />
        {showToken && <GroupKey />}
        {showTestEnableMenu && (
          <EnableTestMenu
            setGroupTestDeadline={setGroupTestDeadline}
            setCurrTestDeadline={setCurrTestDeadline}
            setShowTestEnableMenuGroupId={setShowTestEnableMenuGroupId}
            id={currentGroupId}
          />
        )}

        <AddToGroup groupId={addToGroupId} setGroupId={setAddToGroupId} />

        <AppTable bordered containerProps={{ sx: { mt: '1em' } }}>
          <TableHead>
            <TableRow>
              <TableCell colSpan={2}>
                <div className="space-between" style={{ fontSize: '1.2em' }}>
                  <span data-cy="group-people-teachers-count">
                    <FormattedMessage id="Teachers" /> ({currentGroup.teachers?.length})
                  </span>
                  {currentGroup.is_teaching && (
                    <IconButton
                      data-cy="add-to-group-button"
                      size="small"
                      sx={{ color: ADD_GREEN }}
                      onClick={() => setAddToGroupId(currentGroupId)}
                    >
                      <AddIcon />
                    </IconButton>
                  )}
                </div>
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {currentGroup.teachers.map(teacher => (
              <TableRow key={`teacher-${teacher.userName}`}>
                <TableCell>{teacher.userName}</TableCell>
              </TableRow>
            ))}
            {currentGroup.pending_teachers.map(teacher => (
              <TableRow key={`pending-teacher-${teacher.userName}`}>
                <TableCell>
                  <div className="flex space-between" style={{ alignItems: 'center' }}>
                    <span style={{ color: colors.muted }}>{teacher.userName}</span>
                    {currentUserIsTeacher && (
                      <AppButton
                        data-cy={`resend-invitation-teacher-${teacher.userName}`}
                        onClick={() => handleResendInvitationClick(teacher._id)}
                        size="sm"
                        style={{ marginRight: '1em' }}
                      >
                        <FormattedMessage id="resend-invitation" />
                      </AppButton>
                    )}
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </AppTable>

        {currentGroup.is_teaching && (
          <AppTable bordered containerProps={{ sx: { mt: '1.5em' } }}>
            <TableHead>
              <TableRow>
                <TableCell colSpan={2}>
                  <div className="space-between" style={{ fontSize: '1.2em' }}>
                    <span data-cy="group-people-students-count">
                      <FormattedMessage id="students" /> ({currentGroup.students?.length})
                    </span>
                    <IconButton
                      data-cy="add-to-group"
                      size="small"
                      sx={{ color: ADD_GREEN }}
                      onClick={() => setAddToGroupId(currentGroupId)}
                    >
                      <AddIcon />
                    </IconButton>
                  </div>
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {currentGroup.students.map(student => (
                <TableRow key={`student-${student.userName}`}>
                  <TableCell>
                    <div className="flex space-between" style={{ alignItems: 'center' }}>
                      <span>
                        {student.userName} ({student.email})
                      </span>
                      {currentUserIsTeacher && (
                        <IconButton
                          data-cy={`remove-from-group-${student.userName}`}
                          size="small"
                          sx={{ color: colors.error }}
                          onClick={() => removeUser(student._id, 'student')}
                        >
                          <CloseIcon />
                        </IconButton>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ))}
              {currentGroup.pending_students.map(student => (
                <TableRow key={`pending-student-${student.userName}`}>
                  <TableCell>
                    <div className="flex space-between" style={{ alignItems: 'center' }}>
                      <span style={{ color: colors.muted }}>
                        {student.userName} ({student.email})
                      </span>
                      {currentUserIsTeacher && (
                        <div className="flex" style={{ alignItems: 'center', gap: '0.5em' }}>
                          <AppButton
                            data-cy={`resend-invitation-student-${student.userName}`}
                            onClick={() => handleResendInvitationClick(student._id)}
                            size="sm"
                          >
                            <FormattedMessage id="resend-invitation" />
                          </AppButton>
                          <IconButton
                            data-cy={`remove-from-group-${student.userName}`}
                            size="small"
                            sx={{ color: colors.error }}
                            onClick={() => removeUser(student._id, 'pending_student')}
                          >
                            <CloseIcon />
                          </IconButton>
                        </div>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </AppTable>
        )}
      </Box>
    </div>
  )
}

export default GroupPeople
