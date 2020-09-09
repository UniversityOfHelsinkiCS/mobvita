import React from 'react'
import PlainWord from 'Components/PracticeView/PlainWord'
import ExerciseCloze from './ExerciseCloze'
import ExerciseMultipleChoice from './ExerciseMultipleChoice'
import ExerciseHearing from './ExerciseHearing'
import RightAnswer from './RightAsnwer'
import WrongAnswer from './WrongAnswer'
import { useSelector } from 'react-redux'

const ExerciseWord = ({ word, handleAnswerChange, handleMultiselectChange }) => {
  const { attempt, snippetFinished } = useSelector(({ practice }) => practice)
  const currentAnswer = useSelector(({ practice }) => practice.currentAnswers[word.ID])
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
    if (attempt < word.choices.length)
      return (
        <ExerciseMultipleChoice
          tabIndex={word.ID}
          handleChange={handleMultiselectChange}
          key={word.ID}
          word={word}
        />
      )
    else return (
      <WrongAnswer word={word} answer={currentAnswer} tiedAnswer={word.tiedTo} />
    )
  }
  return (
    <ExerciseCloze tabIndex={word.ID} handleChange={handleAnswerChange} key={word.ID} word={word} />
  )
}

export default ExerciseWord
