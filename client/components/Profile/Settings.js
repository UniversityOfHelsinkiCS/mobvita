import React from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { Link } from 'react-router-dom'
import { FormattedMessage, useIntl } from 'react-intl'
import { Checkbox, Radio, Dropdown } from 'semantic-ui-react'
import { Button } from 'react-bootstrap'
import {
  updateMultiChoice,
  updateAudioTask,
  updateSecondTry,
  updateNumberOfFlashcards,
  updateAutoSpeak,
  updatePublishProgress,
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

  const deckSizeOptions = [
    { value: 20, text: <b>20</b>, key: 20 },
    { value: 50, text: <b>50</b>, key: 50 },
    { value: 100, text: <b>100</b>, key: 100 },
    { value: 'all', text: <b>all</b>, key: 'all' },
  ]

  return (
    <div className="const ps-nm">
      <br/>
      {bigWindow && (
        <Button as={Link} to="/concepts" variant="primary" size="sm">
          <FormattedMessage id="learning-settings" />
        </Button>
      )}
      <hr/>
      <h2 className="header-2 pb-sm">
        <FormattedMessage id="select-types-of-exercisesto-practice-34b953b387e6c6f6a7d4aa52ddaf177b" />
      </h2>
      <div className="flex-col align-start gap-row-sm">
        <SettingToggle
          translationId="multiple-choice"
          checked={user.multi_choice}
          onChange={() => dispatch(updateMultiChoice(!user.multi_choice))}
          disabled={pending}
        />
        <br/>
        <span className="pb-sm">
          <FormattedMessage id="type-the-word-you-hear" />:
        </span>
        <div className="gap-col-nm">
          <Radio
            label={intl.formatMessage({ id: 'listen-to-chunks-and-words' })}
            name="audioTask"
            value="chunk"
            checked={user.task_audio === 'chunk'}
            onChange={() => dispatch(updateAudioTask('chunk'))}
          />
          <Radio
            label={intl.formatMessage({ id: 'listen-to-words' })}
            name="audioTask"
            value="word"
            checked={user.task_audio === 'word' || user.task_audio===true}
            onChange={() => dispatch(updateAudioTask('word'))}
          />
          <Radio
            label={intl.formatMessage({ id: 'no-listen-exer' })}
            name="audioTask"
            value="none"
            checked={user.task_audio === 'none' || user.task_audio===false}
            onChange={() => dispatch(updateAudioTask('none'))}
          />
        </div>

        <span style={{ display: 'none', color: 'gray' }}>
          <i>Temporarily unavailable due to technical problem</i>
        </span>
        <br/>
        <SettingToggle
          translationId="second-chance-when-practicing-stories"
          checked={user.second_try}
          onChange={() => dispatch(updateSecondTry(!user.second_try))}
          disabled={pending}
        />
      </div>
      <hr/>
      <h2 className="header-2 pb-sm pt-nm">
        <FormattedMessage id="Audio settings" />
      </h2>
      <span className="pb-sm">
        <FormattedMessage id="Pronounce clicked words" />:
      </span>
      <div className="gap-col-nm">
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
      <hr/>
      <h2 className="header-2 pb-sm pt-nm">
        <FormattedMessage id="Flashcards" />
      </h2>
      <label htmlFor="flashcard-amount" style={{ paddingRight: '0.5rem' }}>
        <FormattedMessage id="how-many-cards-per-practice-session" />:&nbsp;&nbsp;
      </label>
      <Dropdown
        id="flashcard-amount"
        value={user.flashcard_num}
        options={deckSizeOptions}
        onChange={(e, data) => dispatch(updateNumberOfFlashcards(Number(data.value)))}
        disabled={pending}
      />
      <hr/>
      <h2 className="header-2 pb-sm pt-nm">
        <FormattedMessage id="Privacy" />
      </h2>
      <SettingToggle
        translationId="Show my username in leaderboards"
        checked={user.publish_progress}
        onChange={() => dispatch(updatePublishProgress(!user.publish_progress))}
        disabled={pending}
      />
    </div>
  )
}

export default Settings
