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

const ControlExerciseWord = ({ word, handleAddClozeExercise }) => {
  /*
  if (word.surface === '\n\n' || !word.id) {
    return <PlainWord word={word} />
  }
  */
  if (word.listen) {
    console.log('listen')
    return (
      <ExercisePopup>
        <ExerciseHearing tabIndex={word.ID} key={word.ID} word={word} />
      </ExercisePopup>
    )
  }
  if (word.choices) {
    console.log('choices')
    return (
      <ExercisePopup>
        <ExerciseMultipleChoice
          tabIndex={word.ID}
          key={word.ID}
          word={word}
          handleAddClozeExercise={handleAddClozeExercise}
        />
      </ExercisePopup>
    )
  }

  console.log('cloze')

  return (
    <ExercisePopup>
      <ExerciseCloze tabIndex={word.ID} key={word.ID} word={word} />
    </ExercisePopup>
  )
}

export default ControlExerciseWord
