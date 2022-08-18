import React, { useState, useEffect } from 'react'
import VocabularyGraph from 'Components/VocabularyView/VocabularyGraph'
import { useDispatch, useSelector } from 'react-redux'
import {
  getStudentVocabulary,
  getPreviousStudentVocabulary,
} from 'Utilities/redux/groupVocabularyReducer'
import Spinner from 'Components/Spinner'

const StudentVocabularyProgress = ({ student, group, startDate, endDate }) => {
  const dispatch = useDispatch()
  const [graphType, setGraphType] = useState('area')
  const [notMastered, setNotMastered] = useState([])
  const [notMasteredBefore, setNotMasteredBefore] = useState([])
  const [endWords, setEndWords] = useState(0)
  const { studentVocabulary, pending, previousStudentVocabulary, previousPending } = useSelector(
    ({ studentVocabulary }) => studentVocabulary
  )

  useEffect(() => {
    dispatch(getPreviousStudentVocabulary(student._id, group.group_id, startDate))
    setGraphType('area')
  }, [startDate, student])

  useEffect(() => {
    dispatch(getStudentVocabulary(student._id, group.group_id, endDate))
    setGraphType('area')
  }, [endDate, student])

  useEffect(() => {
    if (previousStudentVocabulary?.stats && studentVocabulary?.stats) {
      let initList = []
      let wordsAtEnd = 0
      for (let i = 0; i < studentVocabulary.stats.visit.length; i++) {
        initList = initList.concat(studentVocabulary.stats.visit[i] - studentVocabulary.stats.flashcard[i])
        if (i > 49) {
          wordsAtEnd += (studentVocabulary.stats.visit[i] + studentVocabulary.stats.flashcard[i])
        }
      }
      setNotMastered(initList)
      let initBeforeList = []
      for (let i = 0; i < previousStudentVocabulary.stats.visit.length; i++) {
        initBeforeList = initBeforeList.concat(
          previousStudentVocabulary.stats.visit[i] - previousStudentVocabulary.stats.flashcard[i]
        )
        if (i > 49) {
          wordsAtEnd += (previousStudentVocabulary.stats.visit[i] + previousStudentVocabulary.stats.flashcard[i])
        }
      }
      setEndWords(wordsAtEnd)
      setNotMasteredBefore(initBeforeList)
    }
  }, [previousStudentVocabulary?.stats, studentVocabulary?.stats])

  if (pending) {
    return <Spinner />
  }

  return (
    <VocabularyGraph
      vocabularyData={previousStudentVocabulary.stats}
      pending={previousPending}
      newerVocabularyData={studentVocabulary.stats}
      newerVocabularyPending={pending}
      graphType={graphType}
      setGraphType={setGraphType}
      notMastered={notMastered}
      notMasteredBefore={notMasteredBefore}
      endWords={endWords}
    />
  )
}

export default StudentVocabularyProgress
