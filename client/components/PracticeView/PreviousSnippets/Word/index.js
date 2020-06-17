import React from 'react'
import PlainWord from 'Components/PracticeView/PlainWord'
import PreviousExerciseWord from './PreviousExerciseWord'

const Word = ({ word, answer, handleWordClick }) => {
  if (word.tested) {
    return (
      <PreviousExerciseWord word={word} handleWordClick={handleWordClick} answer={answer} />
    )
  }

  return <PlainWord surface={word.surface} lemmas={word.lemmas} handleWordClick={handleWordClick} />
}

export default Word
