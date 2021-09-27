import React, { useState, useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { FormattedMessage, useIntl } from 'react-intl'
import { Checkbox, Radio, Dropdown } from 'semantic-ui-react'
import { localeNameToCode, localeOptions, hiddenFeatures } from 'Utilities/common'
import { Button } from 'react-bootstrap'
import {
  updateLocale,
  updateBlankFilling,
  updateAudioTask,
  updateSecondTry,
  updateNumberOfFlashcards,
  updateAutoSpeak,
  updatePublishProgress,
  updateParticipleExer,
} from 'Utilities/redux/userReducer'
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
      <h2 className="profile-page-setting-header">
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
      <h2 className="profile-page-setting-header">
        <FormattedMessage id="practice-settings" />
      </h2>
      <div className="flex-col align-start gap-row-sm">
        <SettingToggle
          translationId="multiple-choice-quizzes-only"
          checked={!user.blank_filling}
          onChange={() => dispatch(updateBlankFilling(!user.blank_filling))}
          disabled={pending}
        />
        <SettingToggle
          translationId="multiple-chances-when-practicing"
          checked={user.second_try}
          onChange={() => dispatch(updateSecondTry(!user.second_try))}
          disabled={pending}
        />

        {hiddenFeatures && (
          <div>
            <hr />
            <span className="pb-sm">
              <FormattedMessage id="participle-exercise" /> (staging only):
            </span>
            <div className="gap-col-nm" style={{ marginTop: '1em' }}>
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
            </div>
          </div>
        )}
      </div>

      <hr />

      <h2 className="profile-page-setting-header">
        <FormattedMessage id="Flashcards" />
      </h2>
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
      <h2 className="profile-page-setting-header">
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
      <hr />
      <h2 className="profile-page-setting-header">
        <FormattedMessage id="Privacy" />
      </h2>
      <SettingToggle
        translationId="Show my username in leaderboards"
        checked={user.publish_progress}
        onChange={() => dispatch(updatePublishProgress(!user.publish_progress))}
        disabled={pending}
      />
      <hr />
      <LearningSettingsModal
        trigger={
          <Button variant="primary" size="lg">
            <FormattedMessage id="learning-settings" />
          </Button>
        }
      />
    </div>
  )
}

export default Settings
