import React from 'react'
import PlainWord from 'Components/CommonStoryTextComponents/PlainWord'
import { useSelector } from 'react-redux'
import { Popup } from 'semantic-ui-react'
import { useIntl } from 'react-intl'
import ExerciseCloze from './ExerciseCloze'
import ExerciseMultipleChoice from './ExerciseMultipleChoice'
import ExerciseHearing from './ExerciseHearing'

const ExercisePopup = ({ children }) => {
  const intl = useIntl()
  return (
    <Popup
      position="top center"
      content={intl.formatMessage({ id: 'click-to-remove-exercise' })}
      trigger={<span>{children}</span>}
    />
  )
}

const ControlExerciseWord = ({ word, handleAddClozeExercise, exerChoices }) => {
  /*
  if (word.surface === '\n\n' || !word.id) {
    return <PlainWord word={word} />
  }
  */
  if (word.listen) {
    return (
      <ExercisePopup>
        <ExerciseHearing tabIndex={word.ID} key={word.ID} word={word} />
      </ExercisePopup>
    )
  }
  if (word.choices || exerChoices) {
    // console.log('word HAS choices ', word)
    return (
      <ExercisePopup>
        <ExerciseMultipleChoice
          tabIndex={word.ID}
          key={word.ID}
          word={word}
          handleAddClozeExercise={handleAddClozeExercise}
          choices={exerChoices || word.choices}
        />
      </ExercisePopup>
    )
  }

  if (word.ID === 6) {
    console.log('why is this a cloze?', word)
  }

  return (
    <ExercisePopup>
      <ExerciseCloze tabIndex={word.ID} key={word.ID} word={word} />
    </ExercisePopup>
  )
}

export default ControlExerciseWord
