import React, { useState } from 'react'
import { Modal } from 'semantic-ui-react'
import { FormattedMessage } from 'react-intl'
import { useDispatch } from 'react-redux'
import { Button, FormControl, Form } from 'react-bootstrap'
import { addToGroup } from 'Utilities/redux/groupsReducer'

const AddToGroup = ({ groupId, setGroupId }) => {
  const [teachers, setTeachers] = useState('')
  const [students, setStudents] = useState('')

  const dispatch = useDispatch()

  const add = event => {
    event.preventDefault()
    const separators = [' ', ',', ';']
    const studentsToAdd = students.split(new RegExp('[' + separators.join('') + ']', 'g')).map(p => p.trim())
    const teachersToAdd = teachers.split(new RegExp('[' + separators.join('') + ']', 'g')).map(p => p.trim())

    dispatch(addToGroup(studentsToAdd, teachersToAdd, groupId))
    setGroupId(null)
  }

  return (
    <Modal dimmer="inverted" closeIcon open={!!groupId} onClose={() => setGroupId(null)}>
      <Modal.Header>
        <FormattedMessage id="add-people-to-group" />
      </Modal.Header>
      <Modal.Content style={{ display: 'flex', flexDirection: 'column' }}>
        <Form className="group-form" onSubmit={add}>
          <span className="sm-label">
            <FormattedMessage id="teacher-emails" />
          </span>
          <FormControl as="textarea" value={teachers} onChange={e => setTeachers(e.target.value)} />
          <span className="sm-label">
            <FormattedMessage id="student-emails" />
          </span>
          <FormControl as="textarea" value={students} onChange={e => setStudents(e.target.value)} />
          <Button variant="primary" type="submit">
            <FormattedMessage id="Confirm" />
          </Button>
        </Form>
      </Modal.Content>
    </Modal>
  )
}

export default AddToGroup
