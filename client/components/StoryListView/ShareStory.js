import React, { useState, useEffect } from 'react'
import { Modal } from 'semantic-ui-react'
import { FormattedMessage } from 'react-intl'
import { useDispatch, useSelector } from 'react-redux'
import { Button, FormControl, Form, Dropdown } from 'react-bootstrap'
import { shareStory } from 'Utilities/redux/shareReducer'
import { getGroups } from 'Utilities/redux/groupsReducer'


const ShareStory = ({ story, isOpen, setOpen }) => {
  const [user, setUser] = useState('')
  const [currentGroup, setCurrentGroup] = useState(null)
  const [message, setMessage] = useState('')
  const groups = useSelector(({ groups }) => groups.groups)


  const dispatch = useDispatch()

  const share = (event) => {
    event.preventDefault()
    const targetGroup = currentGroup ? [currentGroup] : []
    const targetUser = user.trim() ? [user.trim()] : []

    dispatch(shareStory(story._id, targetGroup, targetUser, message))
    setOpen(false)
  }

  console.log(groups)

  return (
    <Modal
      dimmer="inverted"
      closeIcon
      open={isOpen}
      onClose={() => setOpen(false)}
    >
      <Modal.Header><FormattedMessage id="create-new-group" /></Modal.Header>
      <Modal.Content style={{ display: 'flex', flexDirection: 'column' }}>
        <h3>{story.shortTitle}</h3>
        <Form className="share-story-form" data-cy="share-story-form" onSubmit={share}>
          <FormattedMessage id="share-with-a-friend" />
          <FormControl
            as="input"
            onChange={e => setUser(e.target.value)}
          />
          {groups
          && (
          <>
            <FormattedMessage id="share-with-a-group" />
            <Dropdown data-cy="select-group" onSelect={key => setCurrentGroup(key)}>
              <Dropdown.Toggle variant="primary" id="dropdown-basic">
                {currentGroup ? groups.find(group => group.group_id === currentGroup).groupName : 'select a group'}
              </Dropdown.Toggle>
              <Dropdown.Menu>
                {groups.map(group => (
                  <Dropdown.Item eventKey={group.group_id} key={group.group_id}>{group.groupName}</Dropdown.Item>
                ))}
              </Dropdown.Menu>
            </Dropdown>
          </>
          )
            }
          <FormControl
            as="input"
            value={message}
            onChange={e => setMessage(e.target.value)}
          />
          <Button
            disabled={!user.trim() && !currentGroup}
            type="submit"
          >
            <FormattedMessage id="Confirm" />
          </Button>
        </Form>
      </Modal.Content>

    </Modal>
  )
}

export default ShareStory
