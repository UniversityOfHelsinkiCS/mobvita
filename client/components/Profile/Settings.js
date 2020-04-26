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
  const { user } = useSelector(({ user }) => user.data)
  const { pending } = useSelector(({ user }) => user)

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
          checked={user.multi_choice}
          onChange={() => dispatch(updateMultiChoice(!user.multi_choice))}
          disabled={pending}
        />
        <SettingToggle
          translationId="type-the-word-you-hear"
          checked={user.task_audio}
          onChange={() => dispatch(updateAudioTask(!user.task_audio))}
          disabled={pending}
        />
        <span style={{ display: 'none', color: 'gray' }}><i>Temporarily unavailable due to technical problem</i></span>
        <SettingToggle
          translationId="second-chance-when-practicing-stories"
          checked={user.second_try}
          onChange={() => dispatch(updateSecondTry(!user.second_try))}
          disabled={pending}
        />
      </div>
      <h2 className="header-2 padding-bottom-1 padding-top-2">
        <FormattedMessage id="Flashcards" />
      </h2>
      <select
        id="flashcard-amount"
        defaultValue={user.flashcard_num}
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
