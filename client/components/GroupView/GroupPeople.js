import React, { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import {
  removeFromGroup,
  resendGroupInvitation,
  setGroupTestDeadline,
} from 'Utilities/redux/groupsReducer'
import { FormattedMessage } from 'react-intl'
import { Box, TableBody, TableCell, TableHead, TableRow } from '@mui/material'
import AddIcon from '@mui/icons-material/Add'
import CloseIcon from '@mui/icons-material/Close'
import { colors } from 'Assets/mui_theme/designTokens'
import AppTable from 'Components/ui/AppTable'
import AppButton from 'Components/AppButton'
import Spinner from 'Components/Spinner'
import NoGroupsView from './NoGroupsView'
import AddToGroup from './AddToGroup'
import PeopleAddResultModal from './PeopleAddResultModal'
import GroupFunctions from './GroupFunctions'
import GroupKey from './GroupKey'
import EnableTestMenu from './EnableTestMenu'

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

  const removeUser = (userId, role) => {
    dispatch(removeFromGroup(currentGroupId, userId, role))
  }

  const handleResendInvitationClick = userId => {
    dispatch(resendGroupInvitation(currentGroupId, userId))
  }

  if (pending || (totalGroups.length > 0 && !currentGroup))
    return (
      <Spinner fullHeight size={60}/>
    )

  if (totalGroups.length === 0) {
    return <NoGroupsView role={role} />
  }

  const currentUserIsTeacher = currentGroup.is_teaching

  return (
    <div className="group-container">
      <PeopleAddResultModal lastAddInfo={lastAddInfo} />

      <div style={{ margin: '1.5em 0em .75em 0em' }}>
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
      <hr />

      <AddToGroup groupId={addToGroupId} setGroupId={setAddToGroupId} />

      <Box sx={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      <AppTable bordered>
        <TableHead>
          <TableRow>
            <TableCell key="teachers-header" colSpan="2">
              <div className="space-between" style={{ fontSize: '1.2em' }}>
                <FormattedMessage id="Teachers" /> ({currentGroup.teachers?.length})
                {currentGroup.is_teaching && (
                  <AddIcon
                    data-cy="add-to-group-button"
                    style={{ cursor: 'pointer', color: 'rgb(0, 214, 126)' }}
                    fontSize="large"
                    onClick={() => setAddToGroupId(currentGroupId)}
                  />
                )}
              </div>
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {currentGroup.teachers.map(teacher => (
            <TableRow>
              <TableCell key={`teacher-${teacher.userName}`}>{teacher.userName}</TableCell>
            </TableRow>
          ))}
          {currentGroup.pending_teachers.map(teacher => (
            <TableRow>
              <TableCell key={`teacher-${teacher.userName}`}>
                <div className="flex space-between" style={{ alignItems: 'center' }}>
                  <span style={{ color: 'gray' }}>{teacher.userName}</span>
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
        <>
          <AppTable bordered>
            <TableHead>
              <TableRow>
                <TableCell key="students-header" colSpan="2">
                  <div className="space-between" style={{ fontSize: '1.2em' }}>
                    <FormattedMessage id="students" /> ({currentGroup.students?.length})
                    <AddIcon
                      data-cy="add-to-group"
                      style={{ cursor: 'pointer', color: 'rgb(0, 214, 126)' }}
                      fontSize="large"
                      onClick={() => setAddToGroupId(currentGroupId)}
                    />
                  </div>
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {currentGroup.students.map(student => (
                <TableRow>
                  <TableCell key={`student-${student.userName}`}>
                    {student.userName} ({student.email}){' '}
                    {currentUserIsTeacher && (
                      <CloseIcon
                        data-cy={`remove-from-group-${student.userName}`}
                        style={{ cursor: 'pointer', color: 'rgb(239, 135, 132)' }}
                        fontSize="large"
                        onClick={() => removeUser(student._id, 'student')}
                      />
                    )}
                  </TableCell>
                </TableRow>
              ))}
              {currentGroup.pending_students.map(student => (
                <TableRow>
                  <TableCell key={`student-${student.userName}`}>
                    <div className="flex space-between" style={{ alignItems: 'center' }}>
                      <span style={{ color: 'gray' }}>
                        {student.userName} ({student.email}){' '}
                      </span>
                      {currentUserIsTeacher && (
                        <div className="flex" style={{ alignItems: 'center' }}>
                          <AppButton
                            data-cy={`resend-invitation-student-${student.userName}`}
                            onClick={() => handleResendInvitationClick(student._id)}
                            size="sm"
                            style={{ marginRight: '1em' }}
                          >
                            <FormattedMessage id="resend-invitation" />
                          </AppButton>
                          <CloseIcon
                            data-cy={`remove-from-group-${student.userName}`}
                            style={{ cursor: 'pointer' }}
                            sx={{ color: colors.error }}
                            onClick={() => removeUser(student._id, 'pending_student')}
                          />
                        </div>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </AppTable>
        </>
      )}
      </Box>
    </div>
  )
}

export default GroupPeople
