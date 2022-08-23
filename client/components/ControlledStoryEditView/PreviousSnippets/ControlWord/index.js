import React from 'react'
import PlainWord from 'Components/CommonStoryTextComponents/PlainWord'
import PreviousChosenExerciseWord from './PreviousChosenExerciseWord'

const ControlWord = ({ word, focusedConcept }) => {
  if (word?.id) return <PreviousChosenExerciseWord key={word.ID} word={word} />
  return <PlainWord word={word} annotatingAllowed focusedConcept={focusedConcept} />
}

export default ControlWord
