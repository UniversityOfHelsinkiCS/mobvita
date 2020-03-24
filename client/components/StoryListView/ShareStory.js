import React, { useState, useEffect } from 'react'
import { Modal } from 'semantic-ui-react'
import { FormattedMessage, useIntl } from 'react-intl'
import { useDispatch, useSelector } from 'react-redux'
import { Button, FormControl, Form, Dropdown } from 'react-bootstrap'
import { shareStory } from 'Utilities/redux/shareReducer'


const ShareStory = ({ story, isOpen, setOpen }) => {
  const [targetEmail, setTargetEmail] = useState('')
  const [shareTargetGroupId, setShareTargetGroupId] = useState(null)
  const [message, setMessage] = useState('')
  const groupsUserCanShareWith = useSelector(({ groups }) => groups.groups.filter(group => group.is_teaching))
  const activeGroup = useSelector(({ user }) => user.data.user.last_selected_group)

  const intl = useIntl()
  const dispatch = useDispatch()

  useEffect(() => {
    if (groupsUserCanShareWith.length > 0) {
      const preferredGroup = groupsUserCanShareWith.find(group => group.group_id === activeGroup)
      setShareTargetGroupId(preferredGroup ? preferredGroup.group_id : groupsUserCanShareWith[0].group_id)
    }
  }, [groupsUserCanShareWith])

  const share = (event) => {
    event.preventDefault()
    const targetGroup = shareTargetGroupId ? [shareTargetGroupId] : []
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
                disabled
                placeholder={intl.formatMessage({ id: 'enter-email-address' })}
                as="input"
                onChange={e => setTargetEmail(e.target.value)}
              />
            </div>

            <FormControl
              disabled
              style={{ marginTop: '0.5em' }}
              as="input"
              value={message}
              placeholder={intl.formatMessage({ id: 'write-a-message-for-the-receiver-optional' })}
              onChange={e => setMessage(e.target.value)}
            />

            {groupsUserCanShareWith
              && (
                <div style={{ display: 'flex', alignItems: 'center', marginTop: '0.5em' }}>
                  <span>{intl.formatMessage({ id: 'or-share-with-a-group-optional' })}</span>
                  <select
                    data-cy="select-group"
                    defaultValue={shareTargetGroupId}
                    onChange={e => setShareTargetGroupId(e.target.value)}
                  >
                    {groupsUserCanShareWith.map(group => (
                      <option value={group.group_id} key={group.group_id}>{group.groupName}</option>
                    ))}
                  </select>
                </div>
              )
            }

            <Button
              disabled={!shareTargetGroupId}
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
