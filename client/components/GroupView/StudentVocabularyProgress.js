import React, { useEffect } from 'react'
import VocabularyGraph from 'Components/VocabularyView/VocabularyGraph'
import { useDispatch, useSelector } from 'react-redux'
import {
  getStudentVocabulary,
  getPreviousStudentVocabulary,
} from 'Utilities/redux/groupVocabularyReducer'
import Spinner from 'Components/Spinner'

const StudentVocabularyProgress = ({ student, group, startDate, endDate }) => {
  const dispatch = useDispatch()
  const { studentVocabulary, pending, previousStudentVocabulary, previousPending } = useSelector(
    ({ studentVocabulary }) => studentVocabulary
  )

  useEffect(() => {
    dispatch(getPreviousStudentVocabulary(student._id, group.group_id, startDate))
  }, [startDate, student])

  useEffect(() => {
    dispatch(getStudentVocabulary(student._id, group.group_id, endDate))
  }, [endDate, student])

  if (pending) {
    return <Spinner />
  }

  return (
    <VocabularyGraph
      vocabularyData={previousStudentVocabulary.stats}
      pending={previousPending}
      newerVocabularyData={studentVocabulary.stats}
      newerVocabularyPending={pending}
    />
  )
}

export default StudentVocabularyProgress
