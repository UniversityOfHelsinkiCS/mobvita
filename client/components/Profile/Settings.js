import React from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { FormattedMessage, useIntl } from 'react-intl'
import { Checkbox } from 'semantic-ui-react'
import {
  updateMultiChoice,
  updateAudioTask,
  updateSecondTry,
  updateNumberOfFlashcards,
} from 'Utilities/redux/userReducer'

const SettingToggle = ({ translationId, ...props }) => {
  const intl = useIntl()

  return (
    <Checkbox
      toggle
      label={intl.formatMessage({ id: translationId })}
      {...props}
    />
  )
}

const Settings = () => {
  const { data, pending } = useSelector(({ user }) => user)
  const {
    multi_choice: multiChoice,
    task_audio: taskAudio,
    second_try: secondTry,
    flashcard_num: flashcardsShown,
  } = data

  const dispatch = useDispatch()

  return (
    <div className="component-container padding-sides-1">
      <h2 className="header-2 padding-bottom-1">
        <FormattedMessage
          id="select-types-of-exercisesto-practice-34b953b387e6c6f6a7d4aa52ddaf177b"
        />
      </h2>
      <div className="flex-column gap-row-1">
        <SettingToggle
          translationId="multiple-choice"
          checked={multiChoice}
          onChange={() => dispatch(updateMultiChoice(!multiChoice))}
          disabled={pending}
        />
        <SettingToggle
          translationId="type-the-word-you-hear"
          checked={taskAudio}
          onChange={() => dispatch(updateAudioTask(!taskAudio))}
          disabled={pending}
        />
        <SettingToggle
          translationId="second-chance-when-practicing-stories"
          checked={secondTry}
          onChange={() => dispatch(updateSecondTry(!secondTry))}
          disabled={pending}
        />
      </div>
      <h2 className="header-2 padding-bottom-1 padding-top-2">
        <FormattedMessage id="Flashcards" />
      </h2>
      <select
        id="flashcard-amount"
        defaultValue={flashcardsShown}
        onChange={e => dispatch(updateNumberOfFlashcards(Number(e.target.value)))}
        disabled={pending}
      >
        <option value={25}>25</option>
        <option value={50}>50</option>
        <option value={100}>100</option>
        <option value={0}>all</option>
      </select>
      <label htmlFor="flashcard-amount" style={{ paddingLeft: '1rem' }}>
        <FormattedMessage id="how-many-cards-per-practice-session" />
      </label>
    </div>
  )
}

export default Settings
