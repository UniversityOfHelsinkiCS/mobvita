import React from 'react'
import PlainWord from 'Components/PracticeView/PlainWord'
import ExerciseCloze from './ExerciseCloze'
import ExerciseMultipleChoice from './ExerciseMultipleChoice'
import ExerciseHearing from './ExerciseHearing'
import RightAnswer from './RightAsnwer'

const ExerciseWord = ({ word, handleWordClick, handleAnswerChange, handleMultiselectChange }) => {
  if (word.surface === '\n\n' || !word.id) {
    return (
      <PlainWord
        surface={word.surface}
        lemmas={word.lemmas}
        wordId={word.ID}
        inflectionRef={word.inflection_ref}
        handleWordClick={handleWordClick}
      />
    )
  }
  if (word.tested && !word.isWrong) {
    return <RightAnswer word={word} handleWordClick={handleWordClick} />
  }
  if (word.listen) {
    return (
      <ExerciseHearing
        tabIndex={word.ID}
        handleChange={handleAnswerChange}
        key={word.ID}
        word={word}
      />
    )
  }
  if (word.choices) {
    return (
      <ExerciseMultipleChoice
        tabIndex={word.ID}
        handleChange={handleMultiselectChange}
        key={word.ID}
        word={word}
      />
    )
  }
  return (
    <ExerciseCloze
      tabIndex={word.ID}
      handleChange={handleAnswerChange}
      handleClick={handleWordClick}
      key={word.ID}
      word={word}
    />
  )
}

export default ExerciseWord
