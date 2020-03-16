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

const SettingsModal = ({ trigger }) => {
  const { user } = useSelector(({ user }) => ({ user: user.data.user }))
  const dispatch = useDispatch()
  const concepts = useSelector(({ concepts }) => concepts.concepts)
  const [open, setOpen] = useState(false)

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
  const getConceptsToEnable = (newLevel) => {
    const conceptsThatMatch = []

    concepts.forEach((concept) => {
      const { concept_id, exer_enabled, level } = concept

      const index = skillLevels.findIndex(element => element === newLevel)
      const levelsToBeActivated = skillLevels.slice(0, index + 1)

      if (level) {
        levelsToBeActivated.forEach((levelToBeActivated) => {
          if (level.includes(levelToBeActivated)) {
            conceptsThatMatch.push(concept)
          }
        })
      }
    })
    return conceptsThatMatch
  }

  const getConceptsToDisable = (newLevel) => {
    const index = skillLevels.findIndex(element => element === newLevel)
    if (index === skillLevels.length - 1) return []
    const conceptsToDisable = []

    concepts.forEach((concept) => {
      const { level } = concept
      if (level && !level.includes(newLevel)) {
        conceptsToDisable.push(concept)
      }
    })

    return conceptsToDisable
  }


  const handleLevelSelect = (level) => {
    const conceptsToEnable = getConceptsToEnable(level)
    const conceptsToDisable = getConceptsToDisable(level)

    let temp = conceptsToEnable.reduce((prev, curr) => ({
      ...prev,
      [curr.concept_id]: 1,
    }), {})

    temp = conceptsToDisable.reduce((prev, curr) => ({
      ...prev,
      [curr.concept_id]: 0,
    }), temp)

    dispatch(updateExerciseSettings(temp))
    dispatch(setNotification(`Learning settings set to ${level}`, "success"))
    dispatch(sidebarSetOpen(false))
    setOpen(false)
  }

  useEffect(() => {
    dispatch(getConcepts(user.last_used_language))
  }, [])

  const smallscreen = useWindowDimensions().width < 500

  return (
    <Modal onClose={() => setOpen(false)} onOpen={() => setOpen(true)} open={open} trigger={trigger}>
      <Modal.Header>
        Learning settings
      </Modal.Header>
      <Modal.Content style={{ display: 'flex', flexDirection: 'column' }}>
        <span className="label">Exercise difficulty level</span>
        <ButtonGroup name="difficultyButtons" size="md">
          {levels.map(level => <Button key={level} onClick={() => handleLevelSelect(level)}>{level}</Button>)}
        </ButtonGroup>
        {!smallscreen && (
          <Button
            style={{ alignSelf: 'flex-start', marginLeft: '-0.9em', marginTop: '1em' }}
            variant="link"
            as={Link}
            onClick={() => setOpen(false)}
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
