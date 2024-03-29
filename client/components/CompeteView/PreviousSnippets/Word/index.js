import React from 'react'
import PlainWord from 'Components/CommonStoryTextComponents/PlainWord'
import PreviousExerciseWord from './PreviousExerciseWord'

const Word = ({ word, answer, tiedAnswer, hideFeedback, snippet }) => {
  if (hideFeedback) return <PlainWord word={word} annotatingAllowed snippet />

  // session history in practice & compete mode
  if (word.tested) {
    return <PreviousExerciseWord word={word} answer={answer} tiedAnswer={tiedAnswer} snippet={snippet} />
  }

  // review mode
  if ({}.propertyIsEnumerable.call(word, 'wrong')) { // exists but might be empty
    const answerObj = {
      correct: word.surface,
      concept: word.concept,
      users_answer: word.wrong,
      id: word.ID,
    }
    return <PreviousExerciseWord word={word} snippet={snippet} answer={answerObj} tiedAnswer={null} />
  }
  return <PlainWord word={word} snippet={snippet} annotatingAllowed />
}

export default Word
