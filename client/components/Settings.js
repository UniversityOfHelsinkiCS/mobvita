import React from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { Modal, Checkbox } from 'semantic-ui-react'
import { ButtonGroup, Button } from 'react-bootstrap'
import { useIntl } from 'react-intl'

const Settings = ({ trigger }) => {
  const dispatch = useDispatch()
  const { user } = useSelector(({ user }) => ({ user: user.data.user }))
  const intl = useIntl()


  return (
    <Modal trigger={trigger}>
      <Modal.Header>
        Learning settings
      </Modal.Header>
      <Modal.Content className="flex" style={{ display: 'flex', flexDirection: 'column' }}>
        <label htmlFor="difficultyButtons">Exercise difficulty level</label>
        <ButtonGroup name="difficultyButtons" size="lg">
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
