import React from 'react'
import PlainWord from 'Components/CommonStoryTextComponents/PlainWord'
import { useSelector } from 'react-redux'
import { useIntl, FormattedMessage } from 'react-intl'
import ExerciseCloze from './ExerciseCloze'
import ExerciseMultipleChoice from './ExerciseMultipleChoice'
import ExerciseHearing from './ExerciseHearing'

const ControlExerciseWord = ({ word, exerChoices, setShowRemoveTooltip }) => {
  /*
  if (word.surface === '\n\n' || !word.id) {
    return <PlainWord word={word} />
  }
  */
  if (word.listen) {
    return <ExerciseHearing tabIndex={word.ID} key={word.ID} word={word} />
  }
  if (word.choices || exerChoices) {
    // console.log('word HAS choices ', word)
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
