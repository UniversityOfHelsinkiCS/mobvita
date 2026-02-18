import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { learningLanguageSelector } from 'Utilities/common'
import { getStudentProgress } from 'Utilities/redux/groupProgressReducer'
import { getPracticeHistory } from 'Utilities/redux/practiceHistoryReducer'
import { FormattedMessage } from 'react-intl'
import ProgressGraph from 'Components/ProgressGraph'
import Spinner from 'Components/Spinner'
import XpProgressGraph from 'Components/XpProgressGraph'
import HoursProgressChart from 'Components/HoursProgressChart'

const StudentProgress = ({ student, startDate, endDate, group }) => {
  // const practiceHistory = useSelector(state => state.practiceHistory)
  // const { exerciseHistory, flashcardHistory, pending } = practiceHistory

  //exerciseHistory still uses old statics from user object
  const { pending, exerciseHistory, xpHistory, practiceTimeHistory } = useSelector(({ studentProgress }) => {
    const { progress, pending } = studentProgress

    const { exercise_history: exerciseHistory } = progress
    const { xp_history: xpHistory } = progress
    const { practice_time_history: practiceTimeHistory } = progress
    return { pending, xpHistory, exerciseHistory, practiceTimeHistory }
  })
  const flashcardHistory = []
  const learningLanguage = useSelector(learningLanguageSelector)
  const dispatch = useDispatch()

  useEffect(() => {
    if (!student) return
    dispatch(getStudentProgress(student._id, group.group_id, learningLanguage))
  }, [student])

  useEffect(() => {
    dispatch(getPracticeHistory(startDate, endDate))
  }, [])

  if (pending) {
    return (
      <Spinner
        fullHeight
        size={60}
        text="Loading…"
        textSize={20}
      />
    )
  }

  return (
    <div>
      {student ? (
        <div>
          <div>
            <ProgressGraph
              exerciseHistory={exerciseHistory}
              flashcardHistory={flashcardHistory}
              startDate={startDate}
              endDate={endDate}
            />
          </div>
          <br />
          <HoursProgressChart practiceTimeHistory={practiceTimeHistory} startDate={startDate} endDate={endDate} />
          <br />
          <div>
            <XpProgressGraph xpHistory={xpHistory} startDate={startDate} endDate={endDate} />
          </div>
        </div>
      ) : (
        <div className="group-analytics-no-results">
          <FormattedMessage id="no-students-in-group" />
        </div>
      )}
    </div>
  )
}

export default StudentProgress
