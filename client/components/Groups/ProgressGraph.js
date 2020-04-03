import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { learningLanguageSelector } from 'Utilities/common'
import { getStudentProgress } from 'Utilities/redux/groupProgressReducer'
import { Dropdown } from 'react-bootstrap'

const ProgressGraph = ({ students, groupId }) => {
  const [currentStudent, setCurrentStudent] = useState(students[0])
  const { progress, pending } = useSelector(({ studentProgress }) => studentProgress)
  const learningLanguage = useSelector(learningLanguageSelector)
  const dispatch = useDispatch()

  useEffect(() => {
    dispatch(getStudentProgress(currentStudent._id, groupId, learningLanguage))
  }, [currentStudent])

  return (
    <div className="group-container">
      <Dropdown
        data-cy="select-group"
        className="auto-right"
        onSelect={key => setCurrentStudent(students.find(student => student._id === key))}
      >
        <Dropdown.Toggle variant="primary" id="dropdown-basic">
          {currentStudent.email}
        </Dropdown.Toggle>
        <Dropdown.Menu>
          {students.map(student => (
            <Dropdown.Item eventKey={student._id} key={student._id}>{student.email}</Dropdown.Item>
          ))}
        </Dropdown.Menu>
      </Dropdown>
      <div>
        {progress && progress.exercise_history.map(e => <div key={e.date}>{e.score}</div>)}
      </div>
    </div>
  )
}

export default ProgressGraph
