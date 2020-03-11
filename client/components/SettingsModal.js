import React, { useEffect, useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { Modal } from 'semantic-ui-react'
import { ButtonGroup, Button } from 'react-bootstrap'
import { getConcepts } from 'Utilities/redux/conceptReducer'
import useWindowDimensions from 'Utilities/windowDimensions'
import { Link } from 'react-router-dom'

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
          {levels.map(level => <Button key={level} onClick={() => console.log(level)}>{level}</Button>)}
        </ButtonGroup>
        {!smallscreen && <Button variant="link" as={Link} onClick={() => setOpen(false)} to="/concepts">Advanced settings</Button>}
      </Modal.Content>
    </Modal>
  )
}

export default SettingsModal
