import React, { useEffect } from 'react'
import { useSelector } from 'react-redux'

import ExerciseCloze from 'Components/PracticeView/ExerciseCloze'
import ExerciseMultipleChoice from 'Components/PracticeView/ExerciseMultipleChoice'
import ExerciseHearing from 'Components/PracticeView/ExerciseHearing'

const WordInput = ({
  word,
  handleWordClick,
  handleAnswerChange,
  handleMultiselectChange,
}) => {
  if (word.surface === '\n\n') return <br />
  if (!word.id && !word.lemmas) return word.surface
  if (!word.id) {
    return (
      <span
        role="button"
        tabIndex={-1}
        key={word.ID}
        className="word-interactive"
        onKeyDown={() => handleWordClick(word.surface, word.lemmas, word.ID)}
        onClick={() => handleWordClick(word.surface, word.lemmas, word.ID)}
      >
        {word.surface}
      </span>
    )
  }

  if (word.listen) {
    return (
      <ExerciseHearing
        tabIndex={word.ID}
        handleChange={handleAnswerChange}
        handleClick={handleWordClick}
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

export default WordInput
