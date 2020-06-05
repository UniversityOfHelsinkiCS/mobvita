import React from 'react'
import PlainWord from 'Components/PracticeView/PlainWord'
import PreviousExerciseWord from './PreviousExerciseWord'

const Word = ({ word, answer, handleWordClick }) => {
  if (!answer || (!answer.users_answer && answer.users_answer !== '')) {
    return (
      <PlainWord surface={word.surface} lemmas={word.lemmas} handleWordClick={handleWordClick} />
    )
  }

  return <PreviousExerciseWord word={word} handleWordClick={handleWordClick} answer={answer} />
}

export default Word
