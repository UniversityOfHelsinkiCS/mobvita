import React from 'react'
import PlainWord from 'Components/PracticeView/PlainWord'
import PreviousExerciseWord from './PreviousExerciseWord'

const Word = ({ word, answer, handleWordClick, tiedAnswer }) => {
  if (word.tested) {
    return (
      <PreviousExerciseWord
        word={word}
        handleWordClick={handleWordClick}
        answer={answer}
        tiedAnswer={tiedAnswer}
      />
    )
  }

  return <PlainWord surface={word.surface} lemmas={word.lemmas} handleWordClick={handleWordClick} />
}

export default Word
