import React, { useEffect } from 'react'
import { useSelector } from 'react-redux'

import ExerciseCloze from 'Components/PracticeView/ExerciseCloze'
import ExerciseMultipleChoice from 'Components/PracticeView/ExerciseMultipleChoice'
import ExerciseHearing from 'Components/PracticeView/ExerciseHearing'

const WordInput = ({
  word,
  textToSpeech,
  audio,
  setAudio,
  handleAnswerChange,
  handleMultiselectChange,
}) => {
  const { answers } = useSelector(({ practice }) => practice)

  useEffect(() => {
    if (word.listen) {
      if (!audio.includes(word.ID.toString())) {
        setAudio(audio.concat(word.ID.toString()))
      }
    }
  }, [word])

  if (word.surface === '\n\n') return <br />
  if (!word.id && !word.lemmas) return word.surface
  if (!word.id) {
    return (
      <span
        role="button"
        tabIndex={-1}
        key={word.ID}
        className="word-interactive"
        onKeyDown={() => textToSpeech(word.surface, word.lemmas, word.ID)}
        onClick={() => textToSpeech(word.surface, word.lemmas, word.ID)}
      >
        {word.surface}
      </span>
    )
  }

  const usersAnswer = answers[word.ID] ? answers[word.ID].users_answer : ''

  if (word.listen) {
    return (
      <ExerciseHearing
        tabIndex={word.ID}
        handleChange={handleAnswerChange}
        handleClick={textToSpeech}
        value={usersAnswer}
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
        value={usersAnswer}
        word={word}
      />
    )
  }
  return (
    <ExerciseCloze
      tabIndex={word.ID}
      handleChange={handleAnswerChange}
      handleClick={textToSpeech}
      key={word.ID}
      value={usersAnswer}
      word={word}
    />
  )
}

export default WordInput
