import React, { useState, useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { FormattedMessage, useIntl } from 'react-intl'
import { Checkbox, Radio, Dropdown, Menu, Accordion, Divider } from 'semantic-ui-react'
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
  const [accordionState, setAccordionState] = useState(0)

  const handleLocaleChange = newLocale => {
    dispatch(setLocale(newLocale)) // Sets locale in root reducer...
    if (user) dispatch(updateLocale(newLocale)) // Updates user-object
  }

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

  const handleClick = (e, props) => {
    const { index } = props
    const newIndex = accordionState === index ? -1 : index
    setAccordionState(newIndex)
  }

  const deckSizeOptions = [
    { value: 20, text: <b>20</b>, key: 20 },
    { value: 50, text: <b>50</b>, key: 50 },
    { value: 100, text: <b>100</b>, key: 100 },
    {
      value: 'all',
      text: <b>{intl.formatMessage({ id: 'all' })}</b>,
      key: 'all',
    },
  ]

  return (
    <div>
      <div>
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
          style={{ width: '200px' }}
        />
        <Divider />
        <LearningSettingsModal
          trigger={
            <Button variant="primary" size="lg">
              <FormattedMessage id="learning-settings" />
            </Button>
          }
        />
      </div>
      <Accordion as={Menu} fluid vertical>
        <div className="const ps-nm bg-settings">
          <Menu.Item className="add-story-accordion-item">
            <Accordion.Title
              active={accordionState === 1}
              content={
                <h2 className="profile-page-setting-header">
                  <FormattedMessage id="practice-settings" />
                </h2>
              }
              index={1}
              onClick={handleClick}
            />
            <Accordion.Content
              className="add-story-accordion-item-content"
              active={accordionState === 1}
              content={
                <div className="flex-col gap-row-nm">
                  <Divider />
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
                      <span className="pb-sm bold">
                        <FormattedMessage id="participle-exercise" /> (staging only):
                      </span>
                      <div className="profile-page-radio-button-group">
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
              }
            />
          </Menu.Item>
          <Menu.Item className="add-story-accordion-item">
            <Accordion.Title
              active={accordionState === 2}
              content={
                <h2 className="profile-page-setting-header">
                  <FormattedMessage id="Flashcards" />
                </h2>
              }
              index={2}
              onClick={handleClick}
            />
            <Accordion.Content
              className="add-story-accordion-item-content"
              active={accordionState === 2}
              content={
                <div>
                  <Divider />
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
                </div>
              }
            />
          </Menu.Item>
          <Menu.Item className="add-story-accordion-item">
            <Accordion.Title
              active={accordionState === 3}
              content={
                <h2 className="profile-page-setting-header">
                  <FormattedMessage id="audio-settings" />
                </h2>
              }
              index={3}
              onClick={handleClick}
            />
            <Accordion.Content
              className="add-story-accordion-item-content"
              active={accordionState === 3}
              content={
                <div>
                  <Divider />
                  <span className="pb-sm bold">
                    <FormattedMessage id="Pronounce clicked words" />:
                  </span>
                  <div className="profile-page-radio-button-group">
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
                  <span className="pb-sm bold">
                    <FormattedMessage id="listening-exercises" />:
                  </span>
                  <div className="profile-page-radio-button-group">
                    {hiddenFeatures && (
                      <Radio
                      label={intl.formatMessage({ id: 'listen-to-context' })}
                      name="audioTask"
                      value="context"
                      checked={user.task_audio === 'context'}
                      onChange={() => dispatch(updateAudioTask('context'))}
                    />
                    )}
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
                </div>
              }
            />
          </Menu.Item>
          <Menu.Item className="add-story-accordion-item">
            <Accordion.Title
              active={accordionState === 4}
              content={
                <h2 className="profile-page-setting-header">
                  <FormattedMessage id="Privacy" />
                </h2>
              }
              index={4}
              onClick={handleClick}
            />
            <Accordion.Content
              className="add-story-accordion-item-content"
              active={accordionState === 4}
              content={
                <div>
                  <Divider />
                  <SettingToggle
                    translationId="Show my username in leaderboards"
                    checked={user.publish_progress}
                    onChange={() => dispatch(updatePublishProgress(!user.publish_progress))}
                    disabled={pending}
                  />
                </div>
              }
            />
          </Menu.Item>
        </div>
      </Accordion>
    </div>
  )
}

export default Settings
