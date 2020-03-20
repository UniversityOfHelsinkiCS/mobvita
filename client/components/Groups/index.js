import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useHistory } from 'react-router-dom'
import { getGroups, removeFromGroup } from 'Utilities/redux/groupsReducer'
import {
  Dropdown,
  ListGroup,
  Button,
  Spinner,
} from 'react-bootstrap'
import { FormattedMessage, useIntl } from 'react-intl'
import { Icon } from 'semantic-ui-react'
import { getWeekSummary } from 'Utilities/redux/groupSummaryReducer'
import { learningLanguageSelector } from 'Utilities/common'
import AddGroup from './AddGroup'
import AddToGroup from './AddToGroup'
import CollapsingList from './CollapsingList'
import DeleteConfirmationModal from './DeleteConfirmationModal'
import Summary from './Summary'

const GroupView = () => {
  const intl = useIntl()
  const [addToGroupOpen, setAddToGroupOpen] = useState(false)
  const [addGroupOpen, setAddGroupOpen] = useState(false)
  const [currentGroupId, setCurrentGroupId] = useState(null)
  const [summary, setSummary] = useState(false)
  const userOid = useSelector(({ user }) => user.data.user.oid)
  const learningLanguage = useSelector(learningLanguageSelector)
  const dispatch = useDispatch()
  const history = useHistory()

  const { groups, created, pending } = useSelector(({ groups }) => (
    {
      groups: groups.groups,
      created: groups.created,
      pending: groups.pending,
    }
  ))

  useEffect(() => {
    dispatch(getGroups())
  }, [])

  useEffect(() => {
    if (!groups || groups.length === 0) return
    if (currentGroupId && groups.some(group => group.group_id === currentGroupId)) return
    setCurrentGroupId(groups[0].group_id)
  }, [groups])

  useEffect(() => {
    if (!created) return
    setCurrentGroupId(created.group_id)
  }, [created])

  const removeUser = (userId) => {
    dispatch(removeFromGroup(currentGroupId, userId))
  }

  const handleSettingsClick = () => {
    history.push(`/groups/${currentGroupId}/concepts`)
  }

  const handleSummary = () => {
    dispatch(getWeekSummary(currentGroupId, learningLanguage))
    setSummary(true)
  }

  if (pending) {
    return (
      <div className="spinner-container">
        <Spinner animation="border" variant="primary" size="lg" />
      </div>
    )
  }


  const currentGroup = groups.find(group => group.group_id === currentGroupId)
  if (!currentGroup) {
    return (
      <div className="group-controls">
        <div>you have no groups yet!</div>
        <Button
          data-cy="create-group-modal"
          variant="primary"
          onClick={() => setAddGroupOpen(true)}
        >
          <FormattedMessage id="create-new-group" />
        </Button>

        <AddGroup isOpen={addGroupOpen} setOpen={setAddGroupOpen} />
      </div>
    )
  }

  const currentUserIsTeacher = currentGroup.teachers.find(teacher => teacher._id === userOid)

  return (
    <div className="group-container">
      <div className="group-controls">
        <Dropdown data-cy="select-group" onSelect={key => setCurrentGroupId(key)}>
          <Dropdown.Toggle variant="primary" id="dropdown-basic">
            {currentGroup.groupName}
          </Dropdown.Toggle>
          <Dropdown.Menu>
            {groups.map(group => (
              <Dropdown.Item eventKey={group.group_id} key={group.group_id}>{group.groupName}</Dropdown.Item>
            ))}
          </Dropdown.Menu>
        </Dropdown>
        <Button
          data-cy="create-group-modal"
          variant="info"
          onClick={() => setAddGroupOpen(true)}
        >
          <FormattedMessage id="create-new-group" />
        </Button>

        <AddGroup isOpen={addGroupOpen} setOpen={setAddGroupOpen} />
      </div>
      <CollapsingList header="Teachers">
        <ListGroup>
          {currentGroup.teachers.map(teacher => (
            <ListGroup.Item key={teacher.userName}>{teacher.userName}</ListGroup.Item>
          ))}
        </ListGroup>
      </CollapsingList>
      <CollapsingList header="Students">
        <ListGroup style={{
          maxHeight: '50vh',
          overflowY: 'auto',
        }}
        >
          {currentGroup.students.length === 0 ? <ListGroup.Item /> : currentGroup.students.map(student => (
            <ListGroup.Item style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }} key={student.userName}>
              {student.userName}
              {currentUserIsTeacher && (
                <Icon
                  data-cy={`remove-from-group-${student.userName}`}
                  style={{ cursor: 'pointer' }}
                  name="close"
                  color="red"
                  onClick={() => removeUser(student._id)}
                />
              )
              }
            </ListGroup.Item>
          ))}
        </ListGroup>
      </CollapsingList>
      {currentGroup.is_teaching
        && (
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <Button
              style={{ marginTop: '1em' }}
              data-cy="add-to-group-modal"
              onClick={() => setAddToGroupOpen(true)}
            >
              <FormattedMessage id="add-people-to-group" />
            </Button>
            <Button
              style={{ marginTop: '1em' }}
              onClick={handleSummary}
            >
              <FormattedMessage id="summary" />
            </Button>
            <Button style={{ marginTop: '1em' }} onClick={handleSettingsClick}>
              <FormattedMessage id="learning-settings" />
            </Button>
            <DeleteConfirmationModal
              groupId={currentGroupId}
              trigger={(
                <Button
                  data-cy="delete-group"
                  style={{ marginTop: '1em' }}
                  variant="danger"
                >
                  <Icon name="trash alternate outline" /> {intl.formatMessage({ id: 'delete-group' })}
                </Button>
              )}
            />

            <AddToGroup groupId={currentGroupId} isOpen={addToGroupOpen} setOpen={setAddToGroupOpen} />
          </div>
        )}
      {summary && <Summary />}
    </div>
  )
}

export default GroupView
