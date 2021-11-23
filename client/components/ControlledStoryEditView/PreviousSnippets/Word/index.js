import React from 'react'
import PlainWord from 'Components/CommonStoryTextComponents/PlainWord'
import PreviousChosenExerciseWord from './PreviousChosenExerciseWord'

const Word = ({ word }) => {
  if (word?.id) return <PreviousChosenExerciseWord key={word.ID} word={word} />
  return <PlainWord word={word} annotatingAllowed />
}

export default Word
