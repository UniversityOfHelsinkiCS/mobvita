import React from 'react'
import PlainWord from 'Components/ExercisePickView/PlainWord'
import { useSelector } from 'react-redux'
import ExerciseCloze from './ExerciseCloze'
import ExerciseMultipleChoice from './ExerciseMultipleChoice'
import ExerciseHearing from './ExerciseHearing'
import RightAnswer from './RightAsnwer'
import WrongAnswer from './WrongAnswer'

const ExerciseWord = ({ word, handleAnswerChange, handleMultiselectChange }) => {
  const { attempt, snippetFinished } = useSelector(({ practice }) => practice)

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
    if (attempt < word.choices.length - 1)
      return (
        <ExerciseMultipleChoice
          tabIndex={word.ID}
          handleChange={handleMultiselectChange}
          key={word.ID}
          word={word}
        />
      )
    return <WrongAnswer word={word} />
  }
  return (
    <ExerciseCloze tabIndex={word.ID} handleChange={handleAnswerChange} key={word.ID} word={word} />
  )
}

export default ExerciseWord
