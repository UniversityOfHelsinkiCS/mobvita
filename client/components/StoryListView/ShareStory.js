import React, { useState, useEffect } from 'react'
import { Modal } from 'semantic-ui-react'
import { FormattedMessage, useIntl } from 'react-intl'
import { useDispatch, useSelector } from 'react-redux'
import { Button, FormControl, Form, Dropdown } from 'react-bootstrap'
import { shareStory } from 'Utilities/redux/shareReducer'
import { getGroups } from 'Utilities/redux/groupsReducer'


const ShareStory = ({ story, isOpen, setOpen }) => {
  const [targetEmail, setTargetEmail] = useState('')
  const [currentGroup, setCurrentGroup] = useState(null)
  const [message, setMessage] = useState('')
  const groups = useSelector(({ groups }) => groups.groups)

  const intl = useIntl()


  const dispatch = useDispatch()

  const share = (event) => {
    event.preventDefault()
    const targetGroup = currentGroup ? [currentGroup] : []
    const targetUser = targetEmail.trim() ? [targetEmail.trim()] : []

    dispatch(shareStory(story._id, targetGroup, targetUser, message))
    setTargetEmail('')
    setMessage('')

    setOpen(false)
  }


  return (
    <Modal
      dimmer="inverted"
      closeIcon
      open={isOpen}
      onClose={() => setOpen(false)}
    >
      <Modal.Header><FormattedMessage id="share-story" /></Modal.Header>
      <Modal.Content style={{ display: 'flex', flexDirection: 'column' }}>
        <h3>{story.shortTitle}</h3>
        <Form className="share-story-form" data-cy="share-story-form" onSubmit={share}>

          <div>
            <div>
              <FormattedMessage id="share-story-with-a-friend" />
              <FormControl
                placeholder={intl.formatMessage({ id: 'enter-email-address' })}
                as="input"
                onChange={e => setTargetEmail(e.target.value)}
              />
            </div>

            <FormControl
              style={{ marginTop: '0.5em' }}
              as="input"
              value={message}
              placeholder={intl.formatMessage({ id: 'write-a-message-for-the-receiver-optional' })}
              onChange={e => setMessage(e.target.value)}
            />

            {groups
          && (
          <div style={{ display: 'flex', alignItems: 'center', marginTop: '0.5em' }}>
            <span>Or share with a group (optional)</span>
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
          </div>
          )
            }

            <Button
              disabled={!targetEmail.trim() && !currentGroup}
              type="submit"
            >
              <FormattedMessage id="Confirm" />
            </Button>
          </div>
        </Form>
      </Modal.Content>

    </Modal>
  )
}

export default ShareStory
