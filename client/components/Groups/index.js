import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { getGroups, addStudentsToGroup } from 'Utilities/redux/groupsReducer'
import { Dropdown, Form } from 'react-bootstrap'

const GroupView = () => {
  const [currentGroupId, setCurrentGroupId] = useState(null)
  const [studentsToAdd, setStudentsToAdd] = useState('')
  const dispatch = useDispatch()

  const { groups, pending } = useSelector(({ groups, pending }) => ({ groups: groups.groups, pending }))

  useEffect(() => {
    dispatch(getGroups())
  }, [])

  useEffect(() => {
    if (!groups || currentGroupId) return
    setCurrentGroupId(groups[0].group_id)
  }, [groups])

  const addStudents = () => {
    const students = studentsToAdd.split(',').map(p => p.trim())
    dispatch(addStudentsToGroup(students, currentGroupId))
  }

  if (pending || !currentGroupId || !groups) {
    return null
  }

  const currentGroup = groups.find(group => group.group_id === currentGroupId)

  return (
    <div className="" style={{ }}>
      <Dropdown onSelect={key => setCurrentGroupId(key)}>
        <Dropdown.Toggle variant="info" id="dropdown-basic">
          {currentGroup.groupName}
        </Dropdown.Toggle>

        <Dropdown.Menu>
          {groups.map(group => <Dropdown.Item eventKey={group.group_id}>{group.groupName}</Dropdown.Item>)}
        </Dropdown.Menu>
      </Dropdown>

      <div>{currentGroup.groupName}</div>
      <div>Teachers:</div>
      <ul>
        {currentGroup.teachers.map(teacher => <li key={teacher.userName}>{teacher.userName}</li>)}
      </ul>
      <div>Students:</div>
      <ul>
        {currentGroup.students.map(student => <li key={student.userName}>{student.userName}</li>)}
      </ul>
      <input type="text" value={studentsToAdd} onChange={() => setStudentsToAdd(event.target.value)} />
      <input type="button" value="add students" onClick={addStudents} />
    </div>
  )
}

export default GroupView
