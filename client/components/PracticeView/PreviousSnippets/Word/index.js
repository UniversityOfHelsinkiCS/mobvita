import React from 'react'
import PlainWord from 'Components/PracticeView/PlainWord'
import PreviousExerciseWord from './PreviousExerciseWord'

const Word = ({ word, answer, tiedAnswer }) => {
  if (word.tested) {
    return <PreviousExerciseWord word={word} answer={answer} tiedAnswer={tiedAnswer} />
  }

  return <PlainWord word={word} />
}

export default Word
