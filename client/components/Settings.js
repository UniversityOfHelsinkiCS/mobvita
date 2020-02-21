import React from 'react'
import { useSelector } from 'react-redux'
import { Modal } from 'semantic-ui-react'
import { ButtonGroup, Button } from 'react-bootstrap'

const Settings = ({ trigger }) => {
  const { user } = useSelector(({ user }) => ({ user: user.data.user }))


  return (
    <Modal trigger={trigger}>
      <Modal.Header>
        Learning settings
      </Modal.Header>
      <Modal.Content className="flex" style={{ display: 'flex', flexDirection: 'column' }}>
        <span className="label">Exercise difficulty level</span>
        <ButtonGroup name="difficultyButtons" size="md">
          <Button>A1</Button>
          <Button>A2</Button>
          <Button>B1</Button>
          <Button>B2</Button>
          <Button>C1</Button>
          <Button>C2</Button>
        </ButtonGroup>
      </Modal.Content>
    </Modal>
  )
}

export default Settings
