import React from 'react'
import PlainWord from 'Components/ControlledStoryEditView/PlainWord'
import { useSelector } from 'react-redux'
import { Popup } from 'semantic-ui-react'
import { useIntl } from 'react-intl'
import ExerciseCloze from './ExerciseCloze'
import ExerciseMultipleChoice from './ExerciseMultipleChoice'
import ExerciseHearing from './ExerciseHearing'

const ExercisePopup = ({ translationId, children }) => {
  const intl = useIntl()
  return (
    <Popup
      position="top center"
      content={intl.formatMessage({ id: translationId })}
      trigger={<span>{children}</span>}
    />
  )
}

const ExerciseWord = ({ word }) => {
  const { acceptedTokens } = useSelector(({ controlledPractice }) => controlledPractice)

  const translationId = acceptedTokens.map(t => t.ID).includes(word.ID)
    ? 'click-to-remove-exercise'
    : 'click-to-add-exercise'

  if (word.surface === '\n\n' || !word.id) {
    return <PlainWord word={word} />
  }

  if (word.listen) {
    return (
      <ExercisePopup translationId={translationId}>
        <ExerciseHearing tabIndex={word.ID} key={word.ID} word={word} />
      </ExercisePopup>
    )
  }
  if (word.choices) {
    return (
      <ExercisePopup translationId={translationId}>
        <ExerciseMultipleChoice tabIndex={word.ID} key={word.ID} word={word} />
      </ExercisePopup>
    )
  }
  return (
    <ExercisePopup translationId={translationId}>
      <ExerciseCloze tabIndex={word.ID} key={word.ID} word={word} />
    </ExercisePopup>
  )
}

export default ExerciseWord
