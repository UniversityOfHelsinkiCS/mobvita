import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { getGroups, removeFromGroup, getGroupToken } from 'Utilities/redux/groupsReducer'
import { FormattedMessage } from 'react-intl'
import { Icon, Table } from 'semantic-ui-react'
import { updateGroupSelect } from 'Utilities/redux/userReducer'
import Spinner from 'Components/Spinner'
import NoGroupsView from './NoGroupsView'
import AddToGroup from './AddToGroup'

const GroupPeople = ({ role }) => {
  const currentGroupId = useSelector(({ user }) => user.data.user.last_selected_group)
  const dispatch = useDispatch()

  const [addToGroupId, setAddToGroupId] = useState(null)
  const { groups: totalGroups, created, pending } = useSelector(({ groups }) => groups)
  const groups = totalGroups.filter(group => group.is_teaching === (role === 'teacher'))
  const currentGroup = totalGroups.find(group => group.group_id === currentGroupId)

  useEffect(() => {
    dispatch(getGroups())
  }, [])

  useEffect(() => {
    if (!groups || groups.length === 0) return
    if (currentGroupId && groups.some(group => group.group_id === currentGroupId)) return
    dispatch(updateGroupSelect(groups[0].group_id))
  }, [totalGroups])

  useEffect(() => {
    if (currentGroup && currentGroup.is_teaching) {
      dispatch(getGroupToken(currentGroupId))
    }
  }, [currentGroup])

  useEffect(() => {
    if (!created) return
    dispatch(updateGroupSelect(created.group_id))
  }, [created])

  const compare = (a, b) => {
    if (a.userName.toLowerCase() < b.userName.toLowerCase()) return -1
    if (a.userName.toLowerCase() > b.userName.toLowerCase()) return 1
    return 0
  }

  if (currentGroup) {
    currentGroup.teachers.sort(compare)
    currentGroup.students.sort(compare)
  }

  const removeUser = userId => {
    dispatch(removeFromGroup(currentGroupId, userId))
  }

  if (pending || (totalGroups.length > 0 && !currentGroup))
    return (
      <div style={{ height: '80vh' }}>
        <Spinner />
      </div>
    )

  if (totalGroups.length === 0) {
    return <NoGroupsView role={role} />
  }

  const currentUserIsTeacher = currentGroup.is_teaching

  return (
    <div className="group-container">
      <div style={{ margin: '1.5em 0em .75em 0em' }}>
        <div className="header-2">{currentGroup.groupName}</div>

        <p style={{ paddingLeft: '0.2rem', fontStyle: 'italic' }}>{currentGroup?.description}</p>
      </div>
      <AddToGroup groupId={addToGroupId} setGroupId={setAddToGroupId} />

      <Table size="small" celled>
        <Table.Header>
          <Table.Row>
            <Table.HeaderCell key="teachers-header" colSpan="2">
              <div className="space-between">
                <FormattedMessage id="Teachers" /> ({currentGroup.teachers?.length})
                {currentGroup.is_teaching && (
                  <Icon
                    data-cy="add-to-group-button"
                    style={{ cursor: 'pointer' }}
                    name="plus"
                    color="olive"
                    onClick={() => setAddToGroupId(currentGroupId)}
                  />
                )}
              </div>
            </Table.HeaderCell>
          </Table.Row>
        </Table.Header>
        <Table.Body>
          {currentGroup.teachers.map(teacher => (
            <Table.Row>
              <Table.Cell key={`teacher-${teacher.userName}`}>{teacher.userName}</Table.Cell>
            </Table.Row>
          ))}
        </Table.Body>
      </Table>

      {currentGroup.is_teaching && (
        <>
          <Table size="small" celled>
            <Table.Header>
              <Table.Row>
                <Table.HeaderCell key="students-header" colSpan="2">
                  <div className="space-between">
                    <FormattedMessage id="Students" /> ({currentGroup.students?.length})
                    <Icon
                      data-cy="add-to-group"
                      style={{ cursor: 'pointer' }}
                      name="plus"
                      color="olive"
                      onClick={() => setAddToGroupId(currentGroupId)}
                    />
                  </div>
                </Table.HeaderCell>
              </Table.Row>
            </Table.Header>
            <Table.Body>
              {currentGroup.students.map(student => (
                <Table.Row>
                  <Table.Cell key={`student-${student.userName}`}>
                    {student.userName} ({student.email}){' '}
                    {currentUserIsTeacher && (
                      <Icon
                        data-cy={`remove-from-group-${student.userName}`}
                        style={{ cursor: 'pointer' }}
                        name="close"
                        color="red"
                        onClick={() => removeUser(student._id)}
                      />
                    )}
                  </Table.Cell>
                </Table.Row>
              ))}
            </Table.Body>
          </Table>
        </>
      )}
    </div>
  )
}

export default GroupPeople
