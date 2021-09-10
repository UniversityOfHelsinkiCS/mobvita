import React, { useEffect, useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { Modal, Dropdown, Divider, Radio } from 'semantic-ui-react'
import { FormattedMessage, useIntl } from 'react-intl'
import { ButtonGroup, Button } from 'react-bootstrap'
import { getMetadata } from 'Utilities/redux/metadataReducer'
import useWindowDimensions from 'Utilities/windowDimensions'
import { Link } from 'react-router-dom'
import { updateExerciseSettings, updateExerciseTemplate } from 'Utilities/redux/userReducer'
import { setNotification } from 'Utilities/redux/notificationReducer'
import { sidebarSetOpen } from 'Utilities/redux/sidebarReducer'
import { getGroups } from 'Utilities/redux/groupsReducer'
import { learningLanguageSelector } from 'Utilities/common'

const LearningSettingsModal = ({ trigger }) => {
  const dispatch = useDispatch()
  const intl = useIntl()
  const { concepts, pending } = useSelector(({ metadata }) => metadata)
  const { groups } = useSelector(({ groups }) => groups)
  const { exercise_setting_template: activeTemplate } = useSelector(({ user }) => user.data.user)
  const learningLanguage = useSelector(learningLanguageSelector)
  const [open, setOpen] = useState(false)
  const bigWindow = useWindowDimensions().width >= 640

  useEffect(() => {
    if (!pending) {
      dispatch(getMetadata(learningLanguage))
    }
  }, [learningLanguage])

  useEffect(() => {
    if (open) dispatch(getGroups())
  }, [open])

  const skillLevels = ['A1', 'A2', 'B1', 'B2', 'C1', 'C2']

  /*
  If user selects B1, enable A1,A2,B1.
  */
  const getNewConceptSettings = newLevel => {
    let resultObject = {}
    const index = skillLevels.findIndex(element => element === newLevel)
    const levelsToBeActivated = skillLevels.slice(0, index + 1)

    concepts.forEach(concept => {
      const { level, exer_enabled } = concept
      let pushed = false
      if (level && exer_enabled) {
        levelsToBeActivated.forEach(levelToBeActivated => {
          const isActivated = level.sort()[level.length - 1] === levelToBeActivated
          // match maximum: level.sort()[level.length - 1] === levelToBeActivated
          // match anyone: level.includes(levelToBeActivated)
          // match minimum: level.sort()[0] === levelToBeActivated

          if (isActivated) {
            if (!pushed) {
              resultObject = {
                ...resultObject,
                [concept.concept_id]: 1,
              }
              pushed = true
            }
          }
        })
        if (!pushed) {
          resultObject = {
            ...resultObject,
            [concept.concept_id]: 0,
          }
        }
      }
    })
    return resultObject
  }

  const handleLevelSelect = level => {
    const newConceptSettings = getNewConceptSettings(level)
    dispatch(updateExerciseSettings(newConceptSettings))
    dispatch(setNotification('learning-settings-saved', 'success'))
    dispatch(sidebarSetOpen(false))
    setOpen(false)
  }

  const handleAdvancedSettingsClick = () => {
    setOpen(false)
    dispatch(sidebarSetOpen(false))
  }

  const templateOptions = []
  /*
  {
      key: 'custom',
      text: intl.formatMessage({ id: 'personal-settings' }),
      value: 'custom',
    },
  */

  groups.forEach(group =>
    templateOptions.push({
      key: group.group_id,
      text: group.groupName,
      value: group.group_id,
    })
  )

  const handleTemplateChange = newValue => {
    dispatch(updateExerciseTemplate(newValue))
  }

  return (
    <Modal
      onClose={() => setOpen(false)}
      onOpen={() => setOpen(true)}
      open={open}
      trigger={trigger}
    >
      <Modal.Header>
        <FormattedMessage id="learning-settings" />
      </Modal.Header>
      <Modal.Content style={{ display: 'flex', flexDirection: 'column' }}>
        <label htmlFor="settings-template-selector" className="label">
          <FormattedMessage id="choose-settings-template" />:
        </label>
        <div className="space-between wrap" style={{ marginTop: '1em' }}>
          <div>
            <Radio disabled label="Automatic (system chooses)" />
          </div>
          <div>
            <Radio
              label={intl.formatMessage({ id: 'use-my-personal-settings' })}
              name="templateSelect"
              value="custom"
              checked={activeTemplate === 'custom'}
              onChange={() => handleTemplateChange('custom')}
            />
          </div>
          <div className="flex-col">
            <span>
              <Radio
                label={intl.formatMessage({ id: 'use-my-group-settings' })}
                name="templateSelect"
                checked={activeTemplate !== 'custom'}
                disabled={templateOptions.length === 0}
                onChange={() => handleTemplateChange(templateOptions[0].value)}
              />
              :
            </span>
            <Dropdown
              id="settings-template-selector"
              selection
              options={templateOptions}
              value={activeTemplate}
              disabled={activeTemplate === 'custom' && templateOptions.length === 0}
              onChange={(e, data) => handleTemplateChange(data.value)}
            />
          </div>
        </div>

        <Divider />

        <h2 style={{ fontSize: '17px', fontWeight: '550' }}>
          <FormattedMessage id="personal-settings" />
        </h2>
        <br />
        <label className="label" htmlFor="difficultyButtons">
          <FormattedMessage id="select-cefr-level" />:
        </label>
        <ButtonGroup name="difficultyButtons" id="difficultyButtons" size="md">
          {skillLevels.sort().map(level => (
            <Button
              style={{ marginRight: '10px' }}
              key={level}
              onClick={() => handleLevelSelect(level)}
            >
              {level}
            </Button>
          ))}
        </ButtonGroup>

        {bigWindow && (
          <>
            <Divider />
            <div>
              <Button
                as={Link}
                to="/concepts"
                variant="primary"
                size="lg"
                style={{ marginLeft: '2px' }}
              >
                <FormattedMessage id="advanced-settings" />
              </Button>
              <br />
            </div>
          </>
        )}
        <Divider />

        <span className="additional-info">
          <FormattedMessage id="choose-settings-template-info" />
        </span>
      </Modal.Content>
    </Modal>
  )
}

export default LearningSettingsModal
