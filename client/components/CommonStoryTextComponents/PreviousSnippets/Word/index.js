import React, { useState, useEffect } from 'react'
import { useHistory } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { hiddenFeatures } from 'Utilities/common'
import PlainWord from 'Components/CommonStoryTextComponents/PlainWord'
import PreviousExerciseWord from './PreviousExerciseWord'

const Word = ({ word, tokenWord, answer, tiedAnswer, hideFeedback, snippet }) => {
  const [shouldBeHidden, setShouldBeHidden] = useState(false)
  const history = useHistory()
  const { correctAnswerIDs } = useSelector(({ practice }) => practice)
  const { hiddenWords } = useSelector(({ controlledPractice }) => controlledPractice)
  const isPreviewMode =
    history.location.pathname.includes('preview') ||
    history.location.pathname.includes('controlled-story')

  useEffect(() => {
    if (hiddenWords?.find(hidden => hidden.ID === word.ID)) {
      setShouldBeHidden(true)
    } else {
      setShouldBeHidden(false)
    }
  }, [hiddenWords])

  // "Display feedback" toggle is off
  if (hideFeedback) return <PlainWord word={word} annotatingAllowed />

  // in stag, also highlight words with no exercise concepts in preview mode
  if (hiddenFeatures && isPreviewMode && word.concepts?.length === 0) {
    return <PreviousExerciseWord word={word} tokenWord={tokenWord} snippet={snippet} />
  }

  // preview mode (if concept list is not empty)
  if (isPreviewMode && word.concepts?.length > 0) {
    return <PreviousExerciseWord word={word} tokenWord={tokenWord} snippet={snippet} />
  }

  // session history in practice & compete mode
  if (
    !history.location.pathname.includes('controlled-story') &&
    (word.tested || correctAnswerIDs.includes(word.ID.toString()))
  ) {
    return (
      <PreviousExerciseWord
        word={word}
        tokenWord={tokenWord}
        answer={answer}
        tiedAnswer={tiedAnswer}
        snippet={snippet}
      />
    )
  }

  if (shouldBeHidden) {
    return null
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
    return (
      <PreviousExerciseWord word={word} answer={answerObj} tiedAnswer={null} snippet={snippet} />
    )
  }

  return <PlainWord word={word} annotatingAllowed />
}

export default Word
