import React, { useEffect, useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { Modal, Dropdown, Divider } from 'semantic-ui-react'
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
          if (level.includes(levelToBeActivated)) {
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

  const templateOptions = [
    {
      key: 'custom',
      text: intl.formatMessage({ id: 'personal-settings' }),
      value: 'custom',
    },
  ]

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

  const smallscreen = useWindowDimensions().width < 500

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
          <FormattedMessage id="choose-settings-template" />
        </label>
        <Dropdown
          id="settings-template-selector"
          selection
          options={templateOptions}
          value={activeTemplate}
          onChange={(e, data) => handleTemplateChange(data.value)}
        />
        <br />
        <span className="additional-info">
          <FormattedMessage id="choose-settings-template-info" />
        </span>

        <Divider />

        <h2 style={{ fontSize: '17px', fontWeight: '550' }}>
          <FormattedMessage id="personal-settings" />
        </h2>
        <label className="label" htmlFor="difficultyButtons">
          <FormattedMessage id="Level" />
        </label>
        <ButtonGroup name="difficultyButtons" id="difficultyButtons" size="md">
          {skillLevels.sort().map(level => (
            <Button key={level} onClick={() => handleLevelSelect(level)}>
              {level}
            </Button>
          ))}
        </ButtonGroup>
        <br />
        {!smallscreen && (
          <Button
            style={{ alignSelf: 'flex-start', marginTop: '1em' }}
            variant="primary"
            as={Link}
            onClick={handleAdvancedSettingsClick}
            to="/concepts"
          >
            <FormattedMessage id="advanced-settings" />
          </Button>
        )}
      </Modal.Content>
    </Modal>
  )
}

export default LearningSettingsModal
