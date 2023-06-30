import React from 'react'
import PlainWord from 'Components/CommonStoryTextComponents/PlainWord'
import { useSelector } from 'react-redux'
import ExerciseCloze from './ExerciseCloze'
import ExerciseMultipleChoice from './ExerciseMultipleChoice'
import ExerciseHearing from './ExerciseHearing'
import ExerciseSpeaking from './ExerciseSpeaking'
import RightAnswer from './RightAsnwer'
import WrongAnswer from './WrongAnswer'

const ExerciseWord = ({ word, handleAnswerChange, handleMultiselectChange, hideDifficulty }) => {
  const { attempt, correctAnswerIDs, snippetFinished } = useSelector(({ practice }) => practice)
  if ((word.tested && !word.isWrong) || correctAnswerIDs.includes(word.ID.toString())) {
    return <RightAnswer word={word} hideDifficulty={hideDifficulty} />
  }

  if (word.surface === '\n\n' || !word.id) {
    return <PlainWord word={word} />
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
  if (word.speak) {
    return (
      <ExerciseSpeaking
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
    return <WrongAnswer word={word} hideDifficulty={hideDifficulty} />
  }
  return (
    <ExerciseCloze tabIndex={word.ID} handleChange={handleAnswerChange} key={word.ID} word={word} />
  )
}

export default ExerciseWord
