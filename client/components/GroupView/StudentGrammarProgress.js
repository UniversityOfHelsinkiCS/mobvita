import React, { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { getStudentHistory, getGroupHistory } from 'Utilities/redux/groupHistoryReducer'
import HexagonTest from 'Components/GridHexagon'
import Spinner from 'Components/Spinner'

const StudentGrammarProgress = ({ summaryView = false, student, startDate, endDate, group }) => {
  const [view, setView] = useState('exercise')
  const dispatch = useDispatch()
  const { pending, history } = useSelector(({ studentHistory }) => studentHistory)
  const {
    concepts,
    lesson_topics,
    root_hex_coord,
    pending: conceptsPending,
  } = useSelector(({ metadata }) => metadata)

  useEffect(() => {
    if (!student && !summaryView) return

    if (!summaryView) {
      dispatch(getStudentHistory(student._id, group.group_id, startDate, endDate, view))
    } else {
      dispatch(getGroupHistory(group.group_id, startDate, endDate, view))
    }
  }, [student, startDate, endDate])

  if (pending) {
    return <Spinner fullHeight size={60} />
  }

  if (!history) {
    return <div>No data to show</div>
  }

  return (
    <HexagonTest
      exerciseHistory={history}
      pending={pending}
      concepts={concepts}
      conceptsPending={conceptsPending}
      root_hex_coord={root_hex_coord}
    />
  )
}

export default StudentGrammarProgress
