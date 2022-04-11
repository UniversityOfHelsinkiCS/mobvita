import React, { useEffect } from 'react'
import VocabularyGraph from 'Components/VocabularyView/VocabularyGraph'
import { useDispatch, useSelector } from 'react-redux'
import { getStudentVocabulary } from 'Utilities/redux/groupVocabularyReducer'
import Spinner from 'Components/Spinner'

const StudentVocabularyProgress = ({ student, earlierDate, group }) => {
  const dispatch = useDispatch()
  const { studentVocabulary, pending } = useSelector(({ studentVocabulary }) => studentVocabulary)

  useEffect(() => {
    if (!student) {
      return
    }
    dispatch(getStudentVocabulary(student._id, group.group_id, earlierDate))
  }, [student, earlierDate])

  if (pending) {
    return <Spinner />
  }

  return <VocabularyGraph vocabularyData={studentVocabulary.stats} pending={pending} />
}

export default StudentVocabularyProgress
