import React, { useState, useEffect, useRef } from 'react'
import VocabularyGraph from 'Components/VocabularyView/VocabularyGraph'
import Spinner from 'Components/Spinner'

const StudentVocabularyProgress = ({
  studentVocabulary,
  vocabularyPending,
  previousStudentVocabulary,
  previousPending,
  graphType,
  setGraphType,
}) => {
  const element = useRef()
  const [xAxisLength, setXAxisLength] = useState(102)
  const [initComplete, setInitComplete] = useState(false)

  useEffect(() => {
    if (previousStudentVocabulary?.stats && studentVocabulary?.stats) {
      let wordsAtEnd = 0

      for (let i = 50; i < studentVocabulary.stats.seen?.length; i++) {
        wordsAtEnd += studentVocabulary.stats.seen[i] + studentVocabulary.stats.flashcard[i]
      }

      for (let i = 50; i < previousStudentVocabulary.stats.seen?.length; i++) {
        wordsAtEnd +=
          previousStudentVocabulary.stats.seen[i] + previousStudentVocabulary.stats.flashcard[i]
      }
      wordsAtEnd < 500 ? setXAxisLength(50) : setXAxisLength(102)
      setInitComplete(true)
    }
  }, [previousStudentVocabulary?.stats, studentVocabulary?.stats])

  if (vocabularyPending || previousPending) {
    return (
      <Spinner fullHeight size={60} text={intl.formatMessage({ id: 'loading' })} textSize={20} />
    )
  }

  return initComplete ? (
    <VocabularyGraph
      vocabularyData={previousStudentVocabulary.stats}
      pending={previousPending}
      newerVocabularyData={studentVocabulary.stats}
      newerVocabularyPending={vocabularyPending}
      graphType={graphType}
      setGraphType={setGraphType}
      xAxisLength={xAxisLength}
      element={element}
    />
  ) : (
    <Spinner fullHeight size={60} text={intl.formatMessage({ id: 'loading' })} textSize={20} />
  )
}

export default StudentVocabularyProgress
