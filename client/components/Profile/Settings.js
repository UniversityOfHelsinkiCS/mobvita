import React, { useState, useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { FormattedMessage, FormattedHTMLMessage, useIntl } from 'react-intl'
import { Checkbox, Radio, Dropdown, Menu, Accordion, Divider } from 'semantic-ui-react'
import { localeNameToCode, localeOptions, hiddenFeatures } from 'Utilities/common'
import { Button } from 'react-bootstrap'
import { useLocation } from 'react-router-dom'
import {
  updateLocale,
  updateBlankFilling,
  updateAudioTask,
  updateSpeechTask,
  updateSecondTry,
  updateNumberOfFlashcards,
  updateAutoSpeak,
  updatePublishProgress,
  updateParticipleExer,
  updateEnableRecmd,
  updateIsTeacher,
  updateMultiChoice,
} from 'Utilities/redux/userReducer'
import { setLocale } from 'Utilities/redux/localeReducer'
import ListeningExerciseSettings from 'Components/ListeningExerciseSettings'
import LearningSettingsModal from '../LearningSettingsModal'

const SettingToggle = ({ translationId, ...props }) => {
  return <Checkbox toggle label={{children: <FormattedHTMLMessage id={translationId} />}} {...props} />
}

const Settings = ({teacherView}) => {
  const { data, pending } = useSelector(({ user }) => user)
  const { user } = data
  const { locale } = useSelector(({ locale }) => locale)
  const { groups } = useSelector(({ groups }) => groups)
  const dispatch = useDispatch()
  const intl = useIntl()
  const [localeDropdownOptions, setLocaleDropdownOptions] = useState([])
  const [accordionState, setAccordionState] = useState(0)
  const handleLocaleChange = newLocale => {
    dispatch(setLocale(newLocale)) // Sets locale in root reducer...
    if (user) dispatch(updateLocale(newLocale)) // Updates user-object
  }
  const isTeachingAGroup = groups?.find(g => g.is_teaching)
  const userIsAnonymous = user.email === 'anonymous_email'

  const { hash } = useLocation()

  useEffect(() => {
    switch(hash) {
      case '#user-settings-options':
        setAccordionState(1)
        break
      case '#practice-settings':
        setAccordionState(2)
        break
      case '#flashcards':
        setAccordionState(3)
        break
      case '#audio-settings':
        setAccordionState(4)
        break
      case '#privacy':
        setAccordionState(5)
        break
      case '#notification-settings':
        setAccordionState(6)
        break
    }
  }, [hash])


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
        {!teacherView && (<LearningSettingsModal
          trigger={
            <Button variant="primary" size="lg">
              <FormattedMessage id="learning-settings" />
            </Button>
          }
        />)}
      </div>
      <Accordion as={Menu} fluid vertical>
        <div className="const ps-nm bg-settings">
          <Menu.Item className="add-story-accordion-item">
            <Accordion.Title
              active={accordionState === 1}
              content={
                <h2 className="profile-page-setting-header">
                  <FormattedMessage id="user-settings-options" />
                </h2>
              }
              index={1}
              onClick={handleClick}
            />
            <Accordion.Content
              className="add-story-accordion-item-content"
              active={accordionState === 1}
              content={
                <div>
                  <Divider />
                  <div className="space-evenly" style={{ marginTop: '.5em' }}>
                    <span style={{ marginRight: '.5em', fontSize: '18px' }}>
                      <input
                        type="radio"
                        style={{ marginRight: '.75em' }}
                        onChange={() => dispatch(updateIsTeacher(false))}
                        checked={!user.is_teacher}
                        disabled={true}
                      />
                      <span style={{ color: user.is_teacher ? '#D3D3D3' : '#000000' }}>
                        <FormattedMessage id="user-role-select-student" />
                      </span>
                    </span>
                    <span style={{ marginRight: '.5em', fontSize: '18px' }}>
                      <input
                        type="radio"
                        style={{ marginRight: '.75em' }}
                        onChange={() => dispatch(updateIsTeacher(true))}
                        checked={user.is_teacher}
                        disabled={true}
                      />
                      <span style={{ color: !user.is_teacher ? '#D3D3D3' : '#000000' }}>
                        <FormattedMessage id="user-role-select-teacher" />
                      </span>
                    </span>
                  </div>
                </div>
              }
            />
          </Menu.Item>
          <Menu.Item className="add-story-accordion-item">
            <Accordion.Title
              active={accordionState === 2}
              content={
                <h2 className="profile-page-setting-header">
                  <FormattedMessage id="practice-settings" />
                </h2>
              }
              index={2}
              onClick={handleClick}
            />
            <Accordion.Content
              className="add-story-accordion-item-content"
              active={accordionState === 2}
              content={
                <div className="flex-col gap-row-nm">
                  <Divider />
                  <SettingToggle
                    translationId="practice-grammar-cloze-exercises"
                    checked={user.blank_filling}
                    onChange={() => dispatch(updateBlankFilling(!user.blank_filling))}
                    disabled={pending}
                  />
                  <SettingToggle
                    translationId="practice-grammar-MC-exercises"
                    checked={user.multi_choice}
                    onChange={() => dispatch(updateMultiChoice(!user.multi_choice))}
                    disabled={pending}
                  />
                  {/* <SettingToggle
                    translationId="practice-listening-cloze-exercises"
                    checked={user.task_audio}
                    onChange={() => dispatch(updateAudioTask(!user.task_audio))}
                    disabled={pending}
                  /> */}
                  <ListeningExerciseSettings />
                  {hiddenFeatures && (<SettingToggle
                    translationId="practice-pronunciation-exercises"
                    checked={user.task_speech}
                    onChange={() => dispatch(updateSpeechTask(!user.task_speech))}
                    disabled={pending}
                  />)}
                  <Divider />
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
          {!teacherView && (<Menu.Item className="add-story-accordion-item">
            <Accordion.Title
              active={accordionState === 3}
              content={
                <h2 className="profile-page-setting-header">
                  <FormattedMessage id="Flashcards" />
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
          </Menu.Item>)}
          {!teacherView && (<Menu.Item className="add-story-accordion-item">
            <Accordion.Title
              active={accordionState === 4}
              content={
                <h2 className="profile-page-setting-header">
                  <FormattedMessage id="audio-settings" />
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
                </div>
              }
            />
          </Menu.Item>)}
          {!teacherView && (<Menu.Item className="add-story-accordion-item">
            <Accordion.Title
              active={accordionState === 5}
              content={
                <h2 className="profile-page-setting-header">
                  <FormattedMessage id="Privacy" />
                </h2>
              }
              index={5}
              onClick={handleClick}
            />
            <Accordion.Content
              className="add-story-accordion-item-content"
              active={accordionState === 5}
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
          </Menu.Item>)}
          {/* !teacherView && (<Menu.Item className="add-story-accordion-item">
            <Accordion.Title
              active={accordionState === 6}
              content={
                <h2 className="profile-page-setting-header">
                  <FormattedMessage id="notification-settings" />
                </h2>
              }
              index={6}
              onClick={handleClick}
            />
            <Accordion.Content
              className="add-story-accordion-item-content"
              active={accordionState === 6}
              content={
                <div>
                  <Divider />
                  <SettingToggle
                    translationId="enable-recommendations"
                    checked={user.enable_recmd}
                    onChange={() => dispatch(updateEnableRecmd(!user.enable_recmd))}
                    disabled={pending}
                  />
                </div>
              }
            />
          </Menu.Item>) */}
        </div>
      </Accordion>
    </div>
  )
}

export default Settings
