import React from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { Link } from 'react-router-dom'
import { FormattedMessage, useIntl } from 'react-intl'
import { Checkbox, Radio } from 'semantic-ui-react'
import { Button } from 'react-bootstrap'
import {
  updateMultiChoice,
  updateAudioTask,
  updateSecondTry,
  updateNumberOfFlashcards,
  updateAutoSpeak,
} from 'Utilities/redux/userReducer'
import useWindowDimensions from 'Utilities/windowDimensions'

const SettingToggle = ({ translationId, ...props }) => {
  const intl = useIntl()

  return <Checkbox toggle label={intl.formatMessage({ id: translationId })} {...props} />
}

const Settings = () => {
  const { user } = useSelector(({ user }) => user.data)
  const { pending } = useSelector(({ user }) => user)

  const bigWindow = useWindowDimensions().width >= 640

  const dispatch = useDispatch()
  const intl = useIntl()

  return (
    <div className="component-container padding-sides-1">
      <h2 className="header-2 padding-bottom-1">
        <FormattedMessage id="select-types-of-exercisesto-practice-34b953b387e6c6f6a7d4aa52ddaf177b" />
      </h2>
      <div className="flex-column align-start gap-row-1">
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
        <span style={{ display: 'none', color: 'gray' }}>
          <i>Temporarily unavailable due to technical problem</i>
        </span>
        <SettingToggle
          translationId="second-chance-when-practicing-stories"
          checked={user.second_try}
          onChange={() => dispatch(updateSecondTry(!user.second_try))}
          disabled={pending}
        />
        {bigWindow && (
          <Button as={Link} to="/concepts" variant="link" style={{ paddingLeft: 0 }}>
            <FormattedMessage id="learning-settings" />
          </Button>
        )}
      </div>
      <h2 className="header-2 padding-bottom-1 padding-top-2">
        <FormattedMessage id="Flashcards" />
      </h2>
      <label htmlFor="flashcard-amount" style={{ paddingRight: '0.5rem' }}>
        <FormattedMessage id="how-many-cards-per-practice-session" />
      </label>
      <select
        id="flashcard-amount"
        defaultValue={user.flashcard_num}
        onChange={e => dispatch(updateNumberOfFlashcards(Number(e.target.value)))}
        disabled={pending}
      >
        <option value={20}>20</option>
        <option value={50}>50</option>
        <option value={100}>100</option>
        <option value={0}>all</option>
      </select>
      <h2 className="header-2 padding-bottom-1 padding-top-2">
        <FormattedMessage id="Audio settings" />
      </h2>
      <span className="padding-bottom-1">
        <FormattedMessage id="Pronounce clicked words" />
      </span>
      <div className="gap-2">
        <Radio
          label={intl.formatMessage({ id: 'Always' })}
          name="autoSpeak"
          value="always"
          checked={user.auto_speak === 'always'}
          onChange={() => dispatch(updateAutoSpeak('always'))}
        />
        <Radio
          label={intl.formatMessage({ id: 'Only on demand' })}
          name="autoSpeak"
          value="demand"
          checked={user.auto_speak === 'demand'}
          onChange={() => dispatch(updateAutoSpeak('demand'))}
        />
      </div>
    </div>
  )
}

export default Settings
