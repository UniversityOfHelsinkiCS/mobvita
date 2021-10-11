import React from 'react'
import PlainWord from 'Components/PracticeView/PlainWord'
import PreviousExerciseWord from './PreviousExerciseWord'

const Word = ({ word, answer, tiedAnswer, hideFeedback }) => {
  if (hideFeedback) return <PlainWord word={word} annotatingAllowed />

  // session history in practice & compete mode
  if (word.tested) {
    return <PreviousExerciseWord word={word} answer={answer} tiedAnswer={tiedAnswer} />
  }

  // review and preview modes
  if ({}.propertyIsEnumerable.call(word, 'wrong') || word.concepts) { // exists but might be empty
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
