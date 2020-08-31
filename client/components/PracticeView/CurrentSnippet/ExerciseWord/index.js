import React from 'react'
import PlainWord from 'Components/PracticeView/PlainWord'
import ExerciseCloze from './ExerciseCloze'
import ExerciseMultipleChoice from './ExerciseMultipleChoice'
import ExerciseHearing from './ExerciseHearing'
import RightAnswer from './RightAsnwer'

const ExerciseWord = ({ word, handleAnswerChange, handleMultiselectChange }) => {
  if (word.surface === '\n\n' || !word.id) {
    return <PlainWord word={word} />
  }
  if (word.tested && !word.isWrong) {
    return <RightAnswer word={word} />
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
    <ExerciseCloze tabIndex={word.ID} handleChange={handleAnswerChange} key={word.ID} word={word} />
  )
}

export default ExerciseWord
