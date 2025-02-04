import React from 'react'
import PlainWord from 'Components/CommonStoryTextComponents/PlainWord'
import { useSelector } from 'react-redux'
import ExerciseCloze from './ExerciseCloze'
import ExerciseMultipleChoice from './ExerciseMultipleChoice'
import ExerciseHearing from './ExerciseHearing'
import ExerciseSpeaking from './ExerciseSpeaking'
import RightAnswer from './RightAsnwer'
import WrongAnswer from './WrongAnswer'

const ExerciseWord = ({ word, snippet, handleAnswerChange, handleMultiselectChange, hideDifficulty }) => {
  const { attempt, correctAnswerIDs, snippetFinished } = useSelector(({ practice }) => practice)
  const { answersPending } = useSelector(({ snippets }) => snippets)
  const currentAnswer = useSelector(
      ({ practice }) => practice.currentAnswers[`${word.ID}-${word.id}`]
    )
  if ((word.tested && !word.isWrong) || 
    correctAnswerIDs.includes(word.ID.toString()) || 
    answersPending && currentAnswer && currentAnswer.correct === currentAnswer.users_answer) {
    return <RightAnswer word={word} snippet={snippet} hideDifficulty={hideDifficulty} />
  }

  if (word.surface === '\n\n' || !word.id) {
    return <PlainWord word={word}  snippet={snippet} />
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
          snippet={snippet}
          handleChange={handleMultiselectChange}
          key={word.ID}
          word={word}
        />
      )
    return <WrongAnswer word={word} snippet={snippet} hideDifficulty={hideDifficulty} />
  }
  return (
    <ExerciseCloze tabIndex={word.ID} snippet={snippet} handleChange={handleAnswerChange} key={word.ID} word={word} />
  )
}

export default ExerciseWord
