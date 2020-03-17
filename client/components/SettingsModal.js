import React, { useEffect, useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { Modal } from 'semantic-ui-react'
import { ButtonGroup, Button } from 'react-bootstrap'
import { getConcepts } from 'Utilities/redux/conceptReducer'
import useWindowDimensions from 'Utilities/windowDimensions'
import { Link } from 'react-router-dom'
import { updateExerciseSettings } from 'Utilities/redux/userReducer'
import { setNotification } from 'Utilities/redux/notificationReducer'
import { sidebarSetOpen } from 'Utilities/redux/sidebarReducer'
import { learningLanguageSelector } from 'Utilities/common'

const SettingsModal = ({ trigger }) => {
  const dispatch = useDispatch()
  const { concepts, pending } = useSelector(({ concepts }) => concepts)
  const learningLanguage = useSelector(learningLanguageSelector)
  const [open, setOpen] = useState(false)

  useEffect(() => {
    if (!pending) {
      console.log('Fetching concepts metadata again')
      dispatch(getConcepts(learningLanguage))
    }
  }, [learningLanguage])

  const levels = []
  if (concepts) {
    concepts.forEach((concept) => {
      if (concept.level) {
        concept.level.forEach((level) => {
          if (!levels.includes(level)) levels.push(level)
        })
      }
    })
  }

  const skillLevels = ['A1', 'A2', 'B1', 'B2', 'C1', 'C2']

  /*
  If user selects B1, enable A1,A2,B1.
  */
  const getNewConceptSettings = (newLevel) => {
    let resultObject = {}
    const index = skillLevels.findIndex(element => element === newLevel)
    const levelsToBeActivated = skillLevels.slice(0, index + 1)
    console.log('Gonna activate all these levels: ', levelsToBeActivated)

    concepts.forEach((concept) => {
      const { level, exer_enabled } = concept
      let pushed = false
      if (level && exer_enabled) {
        levelsToBeActivated.forEach((levelToBeActivated) => {
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

  const handleLevelSelect = (level) => {
    console.log('Handling level select ', level)
    const newConceptSettings = getNewConceptSettings(level)
    dispatch(updateExerciseSettings(newConceptSettings))
    dispatch(setNotification(`Learning settings set to ${level}`, 'success'))
    dispatch(sidebarSetOpen(false))
    setOpen(false)
  }

  const handleAdvancedSettingsClick = () => {
    setOpen(false)
    dispatch(sidebarSetOpen(false))
  }

  const smallscreen = useWindowDimensions().width < 500

  return (
    <Modal onClose={() => setOpen(false)} onOpen={() => setOpen(true)} open={open} trigger={trigger}>
      <Modal.Header>
        Learning settings
      </Modal.Header>
      <Modal.Content style={{ display: 'flex', flexDirection: 'column' }}>
        <span className="label">Level</span>
        <ButtonGroup name="difficultyButtons" size="md">
          {levels.sort().map(level => <Button key={level} onClick={() => handleLevelSelect(level)}>{level}</Button>)}
        </ButtonGroup>
        {!smallscreen && (
          <Button
            style={{ alignSelf: 'flex-start', marginLeft: '-0.9em', marginTop: '1em' }}
            variant="link"
            as={Link}
            onClick={handleAdvancedSettingsClick}
            to="/concepts"
          >
            Advanced settings
          </Button>
        )}
      </Modal.Content>
    </Modal>
  )
}

export default SettingsModal
