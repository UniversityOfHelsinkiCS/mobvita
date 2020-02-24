import React, { useState } from 'react'
import { Modal } from 'semantic-ui-react'
import { FormattedMessage } from 'react-intl'
import { useDispatch } from 'react-redux'
import { Button, FormControl, Input } from 'react-bootstrap'
import { addToGroup } from 'Utilities/redux/groupsReducer'


const AddToGroup = ({ groupId, isOpen, setOpen }) => {
  const [teachers, setTeachers] = useState('')
  const [students, setStudents] = useState('')


  const dispatch = useDispatch()

  const add = () => {
    const studentsToAdd = students.split(',').map(p => p.trim())
    const teachersToAdd = teachers.split(',').map(p => p.trim())

    dispatch(addToGroup(studentsToAdd, teachersToAdd, groupId))
    setOpen(false)
  }

  return (
    <Modal
      dimmer="inverted"
      closeIcon
      open={isOpen}
      onClose={() => setOpen(false)}
    >
      <Modal.Header><FormattedMessage id="add-people-to-group" /></Modal.Header>
      <Modal.Content style={{ display: 'flex', flexDirection: 'column' }}>
        <FormattedMessage id="teacher-emails" />
        <FormControl
          as="textarea"
          value={teachers}
          onChange={e => setTeachers(e.target.value)}
        />
        <FormattedMessage id="student-emails" />
        <FormControl
          as="textarea"
          value={students}
          onChange={e => setStudents(e.target.value)}
        />
        <Button
          variant="primary"
          onClick={add}
        >
          <FormattedMessage id="Confirm" />
        </Button>
      </Modal.Content>

    </Modal>
  )
}

export default AddToGroup
