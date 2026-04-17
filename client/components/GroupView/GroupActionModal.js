import React, { useState } from 'react'
import { FormattedMessage } from 'react-intl'
import { useDispatch } from 'react-redux'
import { useHistory } from 'react-router-dom'
import { Button, FormControl, Form } from 'react-bootstrap'
import { Modal } from 'semantic-ui-react'
import { createGroup, joinGroup } from 'Utilities/redux/groupsReducer'

const GroupActionModal = ({ trigger, role }) => {
  const [groupName, setGroupName] = useState('')
  const [description, setDescription] = useState('')
  const [teachers, setTeachers] = useState('')
  const [students, setStudents] = useState('')
  const [token, setToken] = useState('')

  const dispatch = useDispatch()
  const history = useHistory()

  const join = event => {
    event.preventDefault()
    dispatch(joinGroup(token))
    history.push(`/groups/${role}`)
  }

  const addGroup = event => {
    event.preventDefault()
    const studentsToAdd = students.split(',').map(p => p.trim())
    const teachersToAdd = teachers.split(',').map(p => p.trim())

    dispatch(createGroup(groupName, description, studentsToAdd, teachersToAdd))
    history.push(`/groups/${role}`)
  }

  return (
    <Modal
      dimmer="inverted"
      closeIcon={{ style: { top: '1.0535rem', right: '1rem' }, color: 'black', name: 'close' }}
      trigger={trigger}
    >
      <Modal.Header className="bold" as="h2">
        <FormattedMessage id={role === 'student' ? 'join-group' : 'create-new-group'} />
      </Modal.Header>
      <Modal.Content>
        {role === 'student' ? (
          <Form className="group-form" onSubmit={join}>
            <span className="sm-label">
              <FormattedMessage id="enter-token" />
            </span>
            <FormControl as="input" data-cy="group-token" onChange={e => setToken(e.target.value)} />
            <Button type="submit">
              <FormattedMessage id="join-group" />
            </Button>
          </Form>
        ) : (
          <Form className="group-form" data-cy="add-group-form" onSubmit={addGroup}>
            <span className="sm-label">
              <FormattedMessage id="name-of-group" />
            </span>
            <FormControl data-cy="group-name" as="input" onChange={e => setGroupName(e.target.value)} />
            <span className="sm-label">
              <FormattedMessage id="Description" />
            </span>
            <FormControl
              as="textarea"
              data-cy="group-description"
              value={description}
              onChange={e => setDescription(e.target.value)}
            />
            <span className="sm-label">
              <FormattedMessage id="teacher-emails" />
            </span>
            <FormControl
              as="textarea"
              value={teachers}
              onChange={e => setTeachers(e.target.value)}
              data-cy="teacher-emails"
            />
            <span className="sm-label">
              <FormattedMessage id="student-emails" />
            </span>
            <FormControl
              as="textarea"
              value={students}
              onChange={e => setStudents(e.target.value)}
              data-cy="student-emails"
            />
            <Button type="submit">
              <FormattedMessage id="create-group" />
            </Button>
          </Form>
        )}
      </Modal.Content>
    </Modal>
  )
}

export default GroupActionModal
