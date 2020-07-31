import React, { useState } from 'react'
import { FormattedMessage } from 'react-intl'
import { useDispatch } from 'react-redux'
import { useHistory } from 'react-router-dom'
import { Button, FormControl, Form, Card } from 'react-bootstrap'
import { createGroup } from 'Utilities/redux/groupsReducer'

const CreateGroup = () => {
  const [groupName, setGroupName] = useState('')
  const [description, setDescription] = useState('')
  const [teachers, setTeachers] = useState('')
  const [students, setStudents] = useState('')

  const dispatch = useDispatch()
  const history = useHistory()

  const addGroup = event => {
    event.preventDefault()
    const studentsToAdd = students.split(',').map(p => p.trim())
    const teachersToAdd = teachers.split(',').map(p => p.trim())

    dispatch(createGroup(groupName, description, studentsToAdd, teachersToAdd))
    history.push('/groups/analytics')
  }

  return (
    <div className="flex-column padding-sides-2">
      <Card body>
        <Form className="group-form" data-cy="add-group-form" onSubmit={addGroup}>
          <span className="sm-label">
            <FormattedMessage id="name-of-group" />
          </span>
          <FormControl as="input" onChange={e => setGroupName(e.target.value)} />
          <span className="sm-label">
            <FormattedMessage id="Description" />
          </span>
          <FormControl
            as="textarea"
            value={description}
            onChange={e => setDescription(e.target.value)}
          />
          <span className="sm-label">
            <FormattedMessage id="teacher-emails" />
          </span>
          <FormControl as="textarea" value={teachers} onChange={e => setTeachers(e.target.value)} />
          <span className="sm-label">
            <FormattedMessage id="student-emails" />
          </span>
          <FormControl as="textarea" value={students} onChange={e => setStudents(e.target.value)} />
          <Button type="submit">
            <FormattedMessage id="Confirm" />
          </Button>
        </Form>
      </Card>
    </div>
  )
}

export default CreateGroup
