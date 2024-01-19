import React from 'react'
import PlainWord from 'Components/CommonStoryTextComponents/PlainWord'
import ExerciseCloze from './ExerciseCloze'
import ExerciseMultipleChoice from './ExerciseMultipleChoice'
import ExerciseHearing from './ExerciseHearing'

const PreviousChosenExerciseWord = ({ word, snippet }) => {
  if (word.surface === '\n\n' || !word.id) {
    return <PlainWord word={word} snippet={snippet} />
  }

  if (word.listen) {
    return <ExerciseHearing tabIndex={word.ID} key={word.ID} word={word} />
  }

  if (word.choices) {
    return <ExerciseMultipleChoice tabIndex={word.ID} key={word.ID} word={word} />
  }

  return <ExerciseCloze tabIndex={word.ID} key={word.ID} word={word} />
}

export default PreviousChosenExerciseWord
