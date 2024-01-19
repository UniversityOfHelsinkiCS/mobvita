import React from 'react'
import PlainWord from 'Components/CommonStoryTextComponents/PlainWord'
import PreviousChosenExerciseWord from './PreviousChosenExerciseWord'

const ControlWord = ({ word, snippet, focusedConcept }) => {
  if (word?.id) return <PreviousChosenExerciseWord key={word.ID} word={word} snippet={snippet}/>
  return <PlainWord word={word} annotatingAllowed focusedConcept={focusedConcept} snippet={snippet}/>
}

export default ControlWord
