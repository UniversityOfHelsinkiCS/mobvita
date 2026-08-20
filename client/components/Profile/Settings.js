import FormattedHTMLMessage from 'Components/FormattedHTMLMessage';
import React, { useState, useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { FormattedMessage, useIntl } from 'react-intl';
import {
  RadioGroup,
  FormControlLabel,
  Accordion,
  AccordionSummary,
  AccordionDetails,
} from '@mui/material'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import AppRadio from 'Components/ui/AppRadio'
import { colors } from 'Assets/mui_theme/designTokens'
import { localeNameToCode, localeOptions, hiddenFeatures } from 'Utilities/common'
import AppButton from 'Components/AppButton'
import AppSwitch from 'Components/ui/AppSwitch'
import AppSelect from 'Components/ui/AppSelect'
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
  updateShowTooltips,
} from 'Utilities/redux/userReducer'
import { setLocale } from 'Utilities/redux/localeReducer'
import ListeningExerciseSettings from 'Components/ListeningExerciseSettings'
import LearningSettingsModal from '../LearningSettingsModal'

const SettingToggle = ({ translationId, ...props }) => {
  return (
    <FormControlLabel
      control={<AppSwitch {...props} />}
      label={<FormattedHTMLMessage id={translationId} />}
      disabled={props.disabled}
      sx={{
        '& .MuiFormControlLabel-label': {
          marginLeft: '0.5em',
          color: colors.ink,
        },
      }}
    />
  )
}

const Settings = ({teacherView}) => {
  const { data, pending } = useSelector(({ user }) => user)
  const { user } = data
  const { locale } = useSelector(({ locale }) => locale)
  const { groups } = useSelector(({ groups }) => groups)
  const dispatch = useDispatch()
  const intl = useIntl()
  const [localeDropdownOptions, setLocaleDropdownOptions] = useState([])
  const [accordionState, setAccordionState] = useState(7)
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
      label: option.displayName,
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
    { value: 20, label: <b>20</b> },
    { value: 50, label: <b>50</b> },
    { value: 100, label: <b>100</b> },
    {
      value: 'all',
      label: <b>{intl.formatMessage({ id: 'all' })}</b>,
    },
  ]

  return (
    <div>
      <div className="const ps-nm bg-settings">
        <Accordion
          className="add-story-accordion-item"
          expanded={accordionState === 7}
          onChange={e => handleClick(e, { index: 7 })}
        >
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <h2 className="profile-page-setting-header">
              <FormattedMessage id="interface-settings" />
            </h2>
          </AccordionSummary>
          <AccordionDetails className="add-story-accordion-item-content">
            <div>
              <label style={{ display: 'block', paddingBottom: '0.4rem' }}>
                <FormattedMessage id="interface-language" />
              </label>
              <div data-cy="ui-lang-dropdown">
                <AppSelect
                  placeholder={intl.formatMessage({ id: 'choose-interface-language' })}
                  value={actualLocale}
                  options={localeDropdownOptions}
                  onChange={value => handleLocaleChange(value)}
                  variant="tan-outline"
                  minWidth={200}
                />
              </div>
            </div>
          </AccordionDetails>
        </Accordion>

        {!teacherView && (
          <Accordion
            className="add-story-accordion-item"
            expanded={accordionState === 8}
            onChange={e => handleClick(e, { index: 8 })}
          >
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              <h2 className="profile-page-setting-header">
                <FormattedMessage id="learning-settings" />
              </h2>
            </AccordionSummary>
            <AccordionDetails className="add-story-accordion-item-content">
              <div>
                  <LearningSettingsModal
                  trigger={
                    <AppButton variant="primary" size="lg">
                      <FormattedMessage id="learning-settings" />
                    </AppButton>
                  }
                />
              </div>
            </AccordionDetails>
          </Accordion>
        )}

        <Accordion
          className="add-story-accordion-item"
          expanded={accordionState === 1}
          onChange={e => handleClick(e, { index: 1 })}
        >
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <h2 className="profile-page-setting-header">
              <FormattedMessage id="user-settings-options" />
            </h2>
          </AccordionSummary>
          <AccordionDetails className="add-story-accordion-item-content">
            <div>
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
              <SettingToggle
                translationId="enable-tooltips"
                checked={user.show_tooltips ?? Boolean(user.is_new_user)}
                onChange={() =>
                  dispatch(updateShowTooltips(!(user.show_tooltips ?? Boolean(user.is_new_user))))
                }
                disabled={pending}
              />
            </div>
          </AccordionDetails>
        </Accordion>
        <Accordion
          className="add-story-accordion-item"
          expanded={accordionState === 2}
          onChange={e => handleClick(e, { index: 2 })}
        >
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <h2 className="profile-page-setting-header">
              <FormattedMessage id="practice-settings" />
            </h2>
          </AccordionSummary>
          <AccordionDetails className="add-story-accordion-item-content">
            <div className="flex-col gap-row-nm">
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
              <SettingToggle
                translationId="multiple-chances-when-practicing"
                checked={user.second_try}
                onChange={() => dispatch(updateSecondTry(!user.second_try))}
                disabled={pending}
              />

              {hiddenFeatures && (
                <div>
                  <span className="pb-sm bold">
                    <FormattedMessage id="participle-exercise" /> (staging only):
                  </span>
                  <RadioGroup
                    row
                    className="profile-page-radio-button-group"
                    name="part_exer"
                    value={user.part_exer}
                    onChange={e => dispatch(updateParticipleExer(e.target.value))}
                  >
                    <FormControlLabel
                      value="participle"
                      control={<AppRadio />}
                      label={intl.formatMessage({ id: 'participle-base-exer' })}
                    />
                    <FormControlLabel
                      value="verb"
                      control={<AppRadio />}
                      label={intl.formatMessage({ id: 'verb-base-exer' })}
                    />
                  </RadioGroup>
                </div>
              )}
            </div>
          </AccordionDetails>
        </Accordion>
        {!teacherView && (<Accordion
          className="add-story-accordion-item"
          expanded={accordionState === 3}
          onChange={e => handleClick(e, { index: 3 })}
        >
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <h2 className="profile-page-setting-header">
              <FormattedMessage id="Flashcards" />
            </h2>
          </AccordionSummary>
          <AccordionDetails className="add-story-accordion-item-content">
            <div>
              <label htmlFor="flashcard-amount" style={{ paddingRight: '0.5rem' }}>
                <FormattedMessage id="how-many-cards-per-practice-session" />
                :&nbsp;&nbsp;
              </label>
              <AppSelect
                id="flashcard-amount"
                value={user.flashcard_num}
                options={deckSizeOptions}
                onChange={value => dispatch(updateNumberOfFlashcards(Number(value)))}
                disabled={pending}
                variant="tan-outline"
                minWidth={120}
              />
            </div>
          </AccordionDetails>
        </Accordion>)}
        {!teacherView && (<Accordion
          className="add-story-accordion-item"
          expanded={accordionState === 4}
          onChange={e => handleClick(e, { index: 4 })}
        >
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <h2 className="profile-page-setting-header">
              <FormattedMessage id="audio-settings" />
            </h2>
          </AccordionSummary>
          <AccordionDetails className="add-story-accordion-item-content">
            <div>
              <span className="pb-sm bold">
                <FormattedMessage id="Pronounce clicked words" />:
              </span>
              <RadioGroup
                row
                className="profile-page-radio-button-group"
                name="autoSpeak"
                value={user.auto_speak}
                onChange={e => dispatch(updateAutoSpeak(e.target.value))}
              >
                <FormControlLabel
                  value="always"
                  control={<AppRadio />}
                  label={intl.formatMessage({ id: 'Always' })}
                />
                <FormControlLabel
                  value="demand"
                  control={<AppRadio />}
                  label={intl.formatMessage({ id: 'Only on demand' })}
                />
              </RadioGroup>
              <br />
            </div>
          </AccordionDetails>
        </Accordion>)}
        {!teacherView && (<Accordion
          className="add-story-accordion-item"
          expanded={accordionState === 5}
          onChange={e => handleClick(e, { index: 5 })}
        >
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <h2 className="profile-page-setting-header">
              <FormattedMessage id="Privacy" />
            </h2>
          </AccordionSummary>
          <AccordionDetails className="add-story-accordion-item-content">
            <div>
              <SettingToggle
                translationId="Show my username in leaderboards"
                checked={user.publish_progress}
                onChange={() => dispatch(updatePublishProgress(!user.publish_progress))}
                disabled={pending}
              />
            </div>
          </AccordionDetails>
        </Accordion>)}
        {/* !teacherView && (<Accordion
          className="add-story-accordion-item"
          expanded={accordionState === 6}
          onChange={e => handleClick(e, { index: 6 })}
        >
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <h2 className="profile-page-setting-header">
              <FormattedMessage id="notification-settings" />
            </h2>
          </AccordionSummary>
          <AccordionDetails className="add-story-accordion-item-content">
            <div>
              <SettingToggle
                translationId="enable-recommendations"
                checked={user.enable_recmd}
                onChange={() => dispatch(updateEnableRecmd(!user.enable_recmd))}
                disabled={pending}
              />
            </div>
          </AccordionDetails>
        </Accordion>) */}
      </div>
    </div>
  )
}

export default Settings
