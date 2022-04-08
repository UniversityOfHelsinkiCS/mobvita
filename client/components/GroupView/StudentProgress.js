import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { learningLanguageSelector } from 'Utilities/common'
import { getStudentProgress } from 'Utilities/redux/groupProgressReducer'
import { FormattedMessage } from 'react-intl'
import ProgressGraph from 'Components/ProgressGraph'
import Spinner from 'Components/Spinner'

const StudentProgress = ({ student, startDate, endDate, group }) => {
  const { pending, exerciseHistory, flashcardHistory } = useSelector(({ studentProgress }) => {
    const { progress, pending } = studentProgress
    const { exercise_history: exerciseHistory, flashcard_history: flashcardHistory } = progress
    return { pending, exerciseHistory, flashcardHistory }
  })
  const learningLanguage = useSelector(learningLanguageSelector)
  const dispatch = useDispatch()

  useEffect(() => {
    if (!student) return
    dispatch(getStudentProgress(student._id, group.group_id, learningLanguage))
  }, [student])

  console.log('PROGRESS ', exerciseHistory)
  console.log('GROUP ', group.group_id)
  console.log('USER ', student._id)

  if (pending) return <Spinner />

  return (
    <div>
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
