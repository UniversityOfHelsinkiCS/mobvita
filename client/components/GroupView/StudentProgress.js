import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { learningLanguageSelector } from 'Utilities/common'
import { getStudentProgress } from 'Utilities/redux/groupProgressReducer'
import { getPracticeHistory } from 'Utilities/redux/practiceHistoryReducer'
import { FormattedMessage } from 'react-intl'
import ProgressGraph from 'Components/ProgressGraph'
import Spinner from 'Components/Spinner'

const StudentProgress = ({ student, startDate, endDate, group }) => {
  const practiceHistory = useSelector(state => state.practiceHistory)
  const { exerciseHistory, flashcardHistory, pending } = practiceHistory
  //const { exerciseHistory } = practiceHistory
  //exerciseHistory still uses old statics from user object
  // const { pending, exerciseHistory } = useSelector(({ studentProgress }) => {
  //   const { progress, pending } = studentProgress
  //   const { exercise_history: exerciseHistory } = progress
  //   return { pending, exerciseHistory }
  // })
  const learningLanguage = useSelector(learningLanguageSelector)
  const dispatch = useDispatch()

  useEffect(() => {
    if (!student) return
    dispatch(getStudentProgress(student._id, group.group_id, learningLanguage))
  }, [student])

  useEffect(() => {
    dispatch(getPracticeHistory(startDate, endDate))
  }, [])

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
