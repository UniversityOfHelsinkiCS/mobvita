import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { getGroups } from 'Utilities/redux/groupsReducer'
import {
  Dropdown,
  Accordion,
  Card,
  ListGroup,
  Button,
} from 'react-bootstrap'
import { FormattedMessage } from 'react-intl'
import AddGroup from './AddGroup'
import AddToGroup from './AddToGroup'

const GroupView = () => {
  const [addToGroupOpen, setAddToGroupOpen] = useState(false)
  const [addGroupOpen, setAddGroupOpen] = useState(false)
  const [currentGroupId, setCurrentGroupId] = useState(null)
  const dispatch = useDispatch()

  const { groups, pending } = useSelector(({ groups, pending }) => ({ groups: groups.groups, pending }))

  useEffect(() => {
    dispatch(getGroups())
  }, [])

  useEffect(() => {
    if (!groups || currentGroupId || groups.length === 0) return
    setCurrentGroupId(groups[0].group_id)
  }, [groups])

  if (pending || !groups) {
    return null
  }

  if (!currentGroupId) {
    return (
      <div className="groupControls">
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

  const currentGroup = groups.find(group => group.group_id === currentGroupId)

  return (
    <div className="maxContentSize autoMargin">
      <div className="groupControls">
        <Dropdown data-cy="select-group" onSelect={key => setCurrentGroupId(key)}>
          <Dropdown.Toggle variant="info" id="dropdown-basic">
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
          variant="primary"
          onClick={() => setAddGroupOpen(true)}
        >
          <FormattedMessage id="create-new-group" />
        </Button>

        <AddGroup isOpen={addGroupOpen} setOpen={setAddGroupOpen} />
      </div>

      <Accordion style={{ marginBottom: '1em' }}>
        <Card>
          <Accordion.Toggle data-cy="teachers-toggle" as={Card.Header} eventKey="0">
            Teachers
          </Accordion.Toggle>
          <Accordion.Collapse eventKey="0">
            <ListGroup>
              {currentGroup.teachers.map(teacher => (
                <ListGroup.Item key={teacher.userName}>{teacher.userName}</ListGroup.Item>
              ))}
            </ListGroup>
          </Accordion.Collapse>
        </Card>
        <Card>
          <Accordion.Toggle data-cy="students-toggle" as={Card.Header} eventKey="1">
            Students
          </Accordion.Toggle>
          <Accordion.Collapse eventKey="1">
            <ListGroup style={{
              maxHeight: '50vh',
              overflowY: 'auto',
            }}
            >
              {currentGroup.students.map(student => (
                <ListGroup.Item key={student.userName}>{student.userName}</ListGroup.Item>
              ))}
            </ListGroup>
          </Accordion.Collapse>
        </Card>
      </Accordion>
      {currentGroup.is_teaching
      && (
      <>
        <Button
          data-cy="add-to-group-modal"
          onClick={() => setAddToGroupOpen(true)}
        >
          <FormattedMessage id="add-people-to-group" />
        </Button>
        <AddToGroup groupId={currentGroupId} isOpen={addToGroupOpen} setOpen={setAddToGroupOpen} />
      </>
      )}
    </div>
  )
}

export default GroupView
