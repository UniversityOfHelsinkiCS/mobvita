import React, { useState } from 'react'
import { Modal } from 'semantic-ui-react'
import { FormattedMessage } from 'react-intl'
import { useDispatch } from 'react-redux'
import { Button } from 'react-bootstrap'
import { createGroup } from 'Utilities/redux/groupsReducer'


const AddGroup = ({ trigger }) => {
  const [groupName, setGroupName] = useState('')
  const [teachers, setTeachers] = useState('')
  const [students, setStudents] = useState('')


  const dispatch = useDispatch()

  const addGroup = () => {
    const studentsToAdd = students.split(',').map(p => p.trim())
    const teachersToAdd = teachers.split(',').map(p => p.trim())

    dispatch(createGroup(groupName, studentsToAdd, teachersToAdd))
  }

  return (
    <Modal
      dimmer="inverted"
      closeIcon
      trigger={trigger}
    >
      <Modal.Header><FormattedMessage id="create-new-group" /></Modal.Header>
      <Modal.Content style={{ display: 'flex', flexDirection: 'column' }}>
        <FormattedMessage id="name-of-group" />
        <input
          value={groupName}
          onChange={e => setGroupName(e.target.value)}
        />
        <FormattedMessage id="teacher-emails" />

        <input
          value={teachers}
          onChange={e => setTeachers(e.target.value)}
        />
        <FormattedMessage id="student-emails" />
        <input
          value={students}
          onChange={e => setStudents(e.target.value)}
        />
        <Button
          variant="primary"
          onClick={addGroup}
        >
          <FormattedMessage id="Confirm" />
        </Button>
      </Modal.Content>

    </Modal>
  )
}

export default AddGroup
