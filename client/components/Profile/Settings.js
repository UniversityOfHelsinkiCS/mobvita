import React, { useState, useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { Link } from 'react-router-dom'
import { FormattedMessage, useIntl } from 'react-intl'
import { Checkbox, Radio, Dropdown, Icon } from 'semantic-ui-react'
import { localeNameToCode, localeOptions } from 'Utilities/common'
import { Button } from 'react-bootstrap'
import {
  updateLocale,
  updateMultiChoice,
  updateAudioTask,
  updateSecondTry,
  updateNumberOfFlashcards,
  updateAutoSpeak,
  updatePublishProgress,
  updateParticipleExer,
} from 'Utilities/redux/userReducer'
import useWindowDimensions from 'Utilities/windowDimensions'
import { setLocale } from 'Utilities/redux/localeReducer'
import LearningSettingsModal from '../LearningSettingsModal'

const SettingToggle = ({ translationId, ...props }) => {
  const intl = useIntl()

  return <Checkbox toggle label={intl.formatMessage({ id: translationId })} {...props} />
}

const Settings = () => {
  const { user } = useSelector(({ user }) => user.data)
  const { pending } = useSelector(({ user }) => user)
  const locale = useSelector(({ locale }) => locale)
  const bigWindow = useWindowDimensions().width >= 640
  const dispatch = useDispatch()
  const intl = useIntl()

  const [localeDropdownOptions, setLocaleDropdownOptions] = useState([])

  const handleLocaleChange = newLocale => {
    dispatch(setLocale(newLocale)) // Sets locale in root reducer...
    if (user) dispatch(updateLocale(newLocale)) // Updates user-object
  }

  const marginTopButton = '8px'

  useEffect(() => {
    const temp = localeOptions.map(option => ({
      value: option.code,
      text: option.displayName,
      key: option.code,
    }))
    setLocaleDropdownOptions(temp)
  }, [])

  let actualLocale = locale
  if (user && user.interfaceLanguage) {
    actualLocale = localeNameToCode(user.interfaceLanguage)
  }

  const deckSizeOptions = [
    { value: 20, text: <b>20</b>, key: 20 },
    { value: 50, text: <b>50</b>, key: 50 },
    { value: 100, text: <b>100</b>, key: 100 },
    { value: 'all', text: <b>all</b>, key: 'all' },
  ]

  return (
    <div className="const ps-nm">
      <h2 className="header-2 pb-sm pt-nm">
        <FormattedMessage id="interface-language" />
      </h2>
      <Dropdown
        fluid
        placeholder={intl.formatMessage({ id: 'choose-interface-language' })}
        value={actualLocale}
        options={localeDropdownOptions}
        selection
        onChange={(e, data) => handleLocaleChange(data.value)}
        data-cy="ui-lang-dropdown"
        style={{ color: '#777', marginTop: marginTopButton, width: '30%' }}
      />
      <hr />
      <h2 className="header-2 pb-sm pt-nm">
        <FormattedMessage id="select-types-of-exercises-to-practice" />
      </h2>
      <br />
      <LearningSettingsModal
        trigger={
          <Button variant="primary" size="lg">
            <FormattedMessage id="learning-settings" />
          </Button>
        }
      />
      <br />
      <br />
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
          checked={user.task_audio === 'word' || user.task_audio === true}
          onChange={() => dispatch(updateAudioTask('word'))}
        />
        <Radio
          label={intl.formatMessage({ id: 'no-listen-exer' })}
          name="audioTask"
          value="none"
          checked={user.task_audio === 'none' || user.task_audio === false}
          onChange={() => dispatch(updateAudioTask('none'))}
        />
      </div>
      <br />
      <span className="pb-sm">
        <FormattedMessage id="participle-exercise" />:
      </span>
      <div className="gap-col-nm">
        <Radio
          label={intl.formatMessage({ id: 'participle-base-exer' })}
          name="part_exer"
          value="participle"
          checked={user.part_exer === 'participle'}
          onChange={() => dispatch(updateParticipleExer('participle'))}
        />
        <Radio
          label={intl.formatMessage({ id: 'verb-base-exer' })}
          name="part_exer"
          value="verb"
          checked={user.part_exer === 'verb'}
          onChange={() => dispatch(updateParticipleExer('verb'))}
        />
        {/* <Radio
          label={intl.formatMessage({ id: 'no-listen-exer' })}
          name="part_exer"
          value="auto"
          checked={user.part_exer === 'auto'}
          onChange={() => dispatch(updateParticipleExer('auto'))}
        /> */}
      </div>
      <br />
      <div className="flex-col align-start gap-row-sm">
        <SettingToggle
          translationId="multiple-choice"
          checked={user.multi_choice}
          onChange={() => dispatch(updateMultiChoice(!user.multi_choice))}
          disabled={pending}
        />
        <span style={{ display: 'none', color: 'gray' }}>
          <i>Temporarily unavailable due to technical problem</i>
        </span>
        <br />
        <SettingToggle
          translationId="second-chance-when-practicing-stories"
          checked={user.second_try}
          onChange={() => dispatch(updateSecondTry(!user.second_try))}
          disabled={pending}
        />
      </div>
      <br />
      {bigWindow && (
        <>
          <Button as={Link} to="/concepts" variant="primary" size="lg">
            <FormattedMessage id="advanced-settings" />
          </Button>
          <br />
        </>
      )}
      <hr />
      <h2 className="header-2 pb-sm pt-nm">
        <FormattedMessage id="Audio settings" />
      </h2>
      <br />
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
      <hr />
      <h2 className="header-2 pb-sm pt-nm">
        <FormattedMessage id="Flashcards" />
      </h2>
      <br />
      <label htmlFor="flashcard-amount" style={{ paddingRight: '0.5rem' }}>
        <FormattedMessage id="how-many-cards-per-practice-session" />
        :&nbsp;&nbsp;
      </label>
      <Dropdown
        id="flashcard-amount"
        value={user.flashcard_num}
        options={deckSizeOptions}
        onChange={(e, data) => dispatch(updateNumberOfFlashcards(Number(data.value)))}
        disabled={pending}
      />
      <hr />
      <h2 className="header-2 pb-sm pt-nm">
        <FormattedMessage id="Privacy" />
      </h2>
      <br />
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
