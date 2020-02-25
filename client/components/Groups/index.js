import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { getGroups, addStudentsToGroup } from 'Utilities/redux/groupsReducer'
import {
  Dropdown,
  Accordion,
  Card,
  ListGroup,
  InputGroup,
  Button,
  FormControl,
} from 'react-bootstrap'
import { FormattedMessage } from 'react-intl'
import * as L from 'lodash'
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
    if (!groups || currentGroupId) return
    setCurrentGroupId(groups[0].group_id)
  }, [groups])

  if (pending || !currentGroupId || !groups) {
    return null
  }

  const currentGroup = groups.find(group => group.group_id === currentGroupId)

  return (
    <div className="maxContentSize autoMargin">
      <div className="groupControls">
        <Dropdown onSelect={key => setCurrentGroupId(key)}>
          <Dropdown.Toggle variant="info" id="dropdown-basic">
            {currentGroup.groupName}
          </Dropdown.Toggle>
          <Dropdown.Menu>
            {groups.map(group => (
              <Dropdown.Item eventKey={group.group_id}>{group.groupName}</Dropdown.Item>
            ))}
          </Dropdown.Menu>
        </Dropdown>
        <Button variant="primary" onClick={() => setAddGroupOpen(true)}><FormattedMessage id="create-new-group" /></Button>

        <AddGroup isOpen={addGroupOpen} setOpen={setAddGroupOpen} />
      </div>

      <Accordion style={{ marginBottom: '1em' }}>
        <Card>
          <Accordion.Toggle as={Card.Header} eventKey="0">
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
          <Accordion.Toggle as={Card.Header} eventKey="1">
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
      <Button onClick={() => setAddToGroupOpen(true)}><FormattedMessage id="add-people-to-group" /></Button>
      <AddToGroup groupId={currentGroupId} isOpen={addToGroupOpen} setOpen={setAddToGroupOpen} />
    </div>
  )
}

export default GroupView
