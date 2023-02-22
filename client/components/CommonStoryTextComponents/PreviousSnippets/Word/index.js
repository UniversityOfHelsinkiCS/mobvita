import React, { useState, useEffect } from 'react'
import { useHistory } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { hiddenFeatures } from 'Utilities/common'
import PlainWord from 'Components/CommonStoryTextComponents/PlainWord'
import ControlledStoryWord from 'Components/ControlledStoryEditView/ControlledStoryWord'
import PreviousExerciseWord from './PreviousExerciseWord'

const Word = ({ word, answer, tiedAnswer, snippet, hideDifficulty, focusedConcept }) => {
  const [shouldBeHidden, setShouldBeHidden] = useState(false)
  const history = useHistory()
  const { correctAnswerIDs } = useSelector(({ practice }) => practice)
  const { show_review_diff, show_preview_exer } = useSelector(({ user }) => user.data.user)
  const { hiddenWordIds } = useSelector(({ controlledPractice }) => controlledPractice)
  const controlledStory = history.location.pathname.includes('controlled-story')
  const isPreviewMode = history.location.pathname.includes('preview')

  useEffect(() => {
    if (controlledStory && hiddenWordIds?.find(hidden => hidden === word.ID)) {
      setShouldBeHidden(true)
    } else {
      setShouldBeHidden(false)
    }
  }, [hiddenWordIds])

  // "Display feedback" toggle is off
  if (!show_preview_exer && isPreviewMode) {
    return <PlainWord word={word} annotatingAllowed focusedConcept={focusedConcept} />
  }

  if (controlledStory && shouldBeHidden) {
    return null
  }

  if (controlledStory) {
    return <ControlledStoryWord word={word} snippet={snippet} focusedConcept={focusedConcept} />
  }

  // preview mode (if concept list is not empty)
  if (isPreviewMode) {
    return <PreviousExerciseWord word={word} focusedConcept={focusedConcept} />
  }

  // session history in practice & compete mode
  // if (!controlledStory && (word.tested || correctAnswerIDs.includes(word.ID.toString()))) {
  //   return <PreviousExerciseWord word={word} answer={answer} tiedAnswer={tiedAnswer} />
  // }

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
      <PreviousExerciseWord
        word={word}
        answer={answerObj}
        tiedAnswer={tiedAnswer}
        hideDifficulty={hideDifficulty}
        focusedConcept={focusedConcept}
      />
    )
  }

  return (
    <PlainWord
      word={word}
      annotatingAllowed
      hideDifficulty={hideDifficulty}
      focusedConcept={focusedConcept}
    />
  )
}

export default Word
