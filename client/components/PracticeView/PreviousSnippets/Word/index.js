import React from 'react'
import PlainWord from 'Components/PracticeView/PlainWord'
import PreviousExerciseWord from './PreviousExerciseWord'

const Word = ({ word, answer, tiedAnswer }) => {
  if (word.tested) {
    return <PreviousExerciseWord word={word} answer={answer} tiedAnswer={tiedAnswer} />
  }

  if (word.mark) {
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
