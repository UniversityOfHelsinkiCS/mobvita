import React from 'react'
import { useHistory } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { hiddenFeatures } from 'Utilities/common'
import PlainWord from 'Components/CommonStoryTextComponents/PlainWord'
import PreviousExerciseWord from './PreviousExerciseWord'

const Word = ({ word, answer, tiedAnswer, hideFeedback }) => {
  const history = useHistory()
  const { correctAnswerIDs } = useSelector(({ practice }) => practice)
  const isPreviewMode =
    history.location.pathname.includes('preview') ||
    history.location.pathname.includes('controlled-story')

  // "Display feedback" toggle is off
  if (hideFeedback) return <PlainWord word={word} annotatingAllowed />

  // in stag, also highlight words with no exercise concepts in preview mode
  if (hiddenFeatures && isPreviewMode && word.concepts?.length === 0) {
    return <PreviousExerciseWord word={word} />
  }

  // preview mode (if concept list is not empty)
  if (isPreviewMode && word.concepts?.length > 0) {
    console.log(word)
    return <PreviousExerciseWord word={word} />
  }

  // session history in practice & compete mode
  if (word.tested || correctAnswerIDs.includes(word.ID.toString())) {
    return <PreviousExerciseWord word={word} answer={answer} tiedAnswer={tiedAnswer} />
  }

  // review mode (highlight all word objs that have 'wrong' field))
  if ({}.propertyIsEnumerable.call(word, 'wrong')) {
    // field exists but might be empty
    const answerObj = {
      correct: word.surface,
      concept: word.concept,
      users_answer: word.wrong,
      id: word.ID,
    }
    return <PreviousExerciseWord word={word} answer={answerObj} tiedAnswer={null} />
  }
  return <PlainWord word={word} annotatingAllowed />
}

export default Word
