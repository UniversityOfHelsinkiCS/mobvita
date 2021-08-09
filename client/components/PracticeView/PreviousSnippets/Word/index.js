import React from 'react'
import PlainWord from 'Components/PracticeView/PlainWord'
import PreviousExerciseWord from './PreviousExerciseWord'

const Word = ({ word, answer, tiedAnswer }) => {
  // session history in practice & compete mode
  if (word.tested) {
    return <PreviousExerciseWord word={word} answer={answer} tiedAnswer={tiedAnswer} />
  }

  // review mode
  if (word.wrong) {
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
