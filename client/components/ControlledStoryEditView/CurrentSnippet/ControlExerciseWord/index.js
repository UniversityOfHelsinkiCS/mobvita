import React from 'react'
import ExerciseCloze from './ExerciseCloze'
import ExerciseMultipleChoice from './ExerciseMultipleChoice'
import ExerciseHearing from './ExerciseHearing'

const ControlExerciseWord = ({ word, exerChoices, setShowRemoveTooltip }) => {
  if (word.listen) {
    return <ExerciseHearing tabIndex={word.ID} key={word.ID} word={word} />
  }
  if (word.choices || exerChoices) {
    return (
      <ExerciseMultipleChoice
        tabIndex={word.ID}
        key={word.ID}
        word={word}
        choices={exerChoices || word.choices}
        setShowRemoveTooltip={setShowRemoveTooltip}
      />
    )
  }

  return <ExerciseCloze tabIndex={word.ID} key={word.ID} word={word} />
}

export default ControlExerciseWord
