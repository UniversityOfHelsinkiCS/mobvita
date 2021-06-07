import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { learningLanguageSelector } from 'Utilities/common'
import { getStudentProgress } from 'Utilities/redux/groupProgressReducer'
import { FormattedMessage } from 'react-intl'
import { Dropdown } from 'semantic-ui-react'
import ProgressGraph from 'Components/ProgressGraph'
import Spinner from 'Components/Spinner'

const StudentProgress = ({ student, setStudent, startDate, endDate, group }) => {
  const { pending, exerciseHistory, flashcardHistory } = useSelector(({ studentProgress }) => {
    const { progress, pending } = studentProgress
    const { exercise_history: exerciseHistory, flashcard_history: flashcardHistory } = progress
    return { pending, exerciseHistory, flashcardHistory }
  })

  const learningLanguage = useSelector(learningLanguageSelector)
  const dispatch = useDispatch()

  const studentOptions = group?.students.map(student => ({
    key: student._id,
    text: `${student?.userName} (${student?.email})`,
    value: student,
  }))

  const dropDownMenuText = student ? `${student?.userName} (${student?.email})` : '-'

  useEffect(() => {
    if (!student) return
    dispatch(getStudentProgress(student._id, group.group_id, learningLanguage))
  }, [student])

  const handleStudentChange = value => {
    setStudent(value)
  }

  if (pending) return <Spinner />

  return (
    <div>
      <div className="group-analytics-student-dropdown">
        <FormattedMessage id="student" />:{' '}
        <Dropdown
          text={dropDownMenuText}
          selection
          fluid
          options={studentOptions}
          onChange={(_, { value }) => handleStudentChange(value)}
          disabled={!student}
        />
      </div>
      {student ? (
        <ProgressGraph
          exerciseHistory={exerciseHistory}
          flashcardHistory={flashcardHistory}
          startDate={startDate}
          endDate={endDate}
        />
      ) : (
        <div className="group-analytics-no-results">
          <FormattedMessage id="no-students-in-group" />
        </div>
      )}
    </div>
  )
}

export default StudentProgress
