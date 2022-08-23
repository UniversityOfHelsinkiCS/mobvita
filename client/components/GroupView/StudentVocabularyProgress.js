import React, { useState, useEffect } from 'react'
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
  const [notMastered, setNotMastered] = useState([])
  const [notMasteredBefore, setNotMasteredBefore] = useState([])
  const [endWords, setEndWords] = useState(0)
  const [targetCurve, setTargetCurve] = useState([])
  const [xAxisLength, setXAxisLength] = useState(102)

  useEffect(() => {
    if (endWords < 300) {
      setXAxisLength(50)
    } else {
      setXAxisLength(102)
    }
  }, [endWords])

  useEffect(() => {
    if (previousStudentVocabulary?.stats && studentVocabulary?.stats) {
      let initList = []
      let wordsAtEnd = 0
      const B2 = studentVocabulary.stats.target_mastering_curves.B2.params

      for (let i = 0; i < studentVocabulary.stats.seen?.length; i++) {
        initList = initList.concat(
          studentVocabulary.stats.seen[i] - studentVocabulary.stats.flashcard[i]
        )
        if (i > 49) {
          wordsAtEnd += studentVocabulary.stats.seen[i] + studentVocabulary.stats.flashcard[i]
        }
      }
      setNotMastered(initList)
      let initBeforeList = []
      for (let i = 0; i < previousStudentVocabulary.stats.seen?.length; i++) {
        initBeforeList = initBeforeList.concat(
          previousStudentVocabulary.stats.seen[i] - previousStudentVocabulary.stats.flashcard[i]
        )
        if (i > 49) {
          wordsAtEnd +=
            previousStudentVocabulary.stats.seen[i] + previousStudentVocabulary.stats.flashcard[i]
        }
      }
      setEndWords(wordsAtEnd)
      setNotMasteredBefore(initBeforeList)
      let initTarget = []
      for (let i = 0; i < studentVocabulary.stats.mastering_percentage.vocab_bins.length; i++) {
        initTarget = initTarget.concat(
          B2.B / (B2.C * i + B2.D)
        )
      }
      setTargetCurve(initTarget)
    }
  }, [previousStudentVocabulary?.stats, studentVocabulary?.stats])

  if (vocabularyPending || previousPending) {
    return <Spinner />
  }

  return (
    <VocabularyGraph
      vocabularyData={previousStudentVocabulary.stats}
      pending={previousPending}
      newerVocabularyData={studentVocabulary.stats}
      newerVocabularyPending={vocabularyPending}
      graphType={graphType}
      setGraphType={setGraphType}
      notMastered={notMastered}
      notMasteredBefore={notMasteredBefore}
      targetCurve={targetCurve}
      xAxisLength={xAxisLength}
    />
  )
}

export default StudentVocabularyProgress
