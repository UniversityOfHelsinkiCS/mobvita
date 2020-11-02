import React, { useState, useEffect } from 'react'
import { Modal, Radio } from 'semantic-ui-react'
import { FormattedMessage, useIntl } from 'react-intl'
import { useDispatch, useSelector } from 'react-redux'
import { Button, FormControl, Form, Dropdown } from 'react-bootstrap'
import { shareStory } from 'Utilities/redux/shareReducer'

const ShareStory = ({ story, isOpen, setOpen }) => {
  const [targetEmail, setTargetEmail] = useState('')
  const [shareTargetGroupId, setShareTargetGroupId] = useState(null)
  const [message, setMessage] = useState('')
  const groupsUserCanShareWith = useSelector(({ groups }) =>
    groups.groups.filter(group => group.is_teaching)
  )
  const activeGroup = useSelector(({ user }) => user.data.user.last_selected_group)

  const intl = useIntl()
  const dispatch = useDispatch()

  useEffect(() => {
    if (groupsUserCanShareWith.length > 0) {
      const preferredGroup = groupsUserCanShareWith.find(group => group.group_id === activeGroup)
      setShareTargetGroupId(
        preferredGroup ? preferredGroup.group_id : groupsUserCanShareWith[0].group_id
      )
    }
  }, [])

  const share = event => {
    event.preventDefault()
    const targetGroup = shareTargetGroupId ? [shareTargetGroupId] : []
    const targetUser = targetEmail.trim() ? [targetEmail.trim()] : []

    dispatch(shareStory(story._id, targetGroup, targetUser, message))
    setTargetEmail('')
    setMessage('')

    setOpen(false)
  }

  const handleGroupChange = e => {
    setShareTargetGroupId(e.target.value)
  }

  return (
    <Modal dimmer="inverted" closeIcon open={isOpen} onClose={() => setOpen(false)}>
      <Modal.Header>
        <span style={{ color: '#777' }}>
          <FormattedMessage id="share-story" />:{' '}
        </span>
        <span style={{ color: '#000', opacity: '.4' }}> {story.shortTitle}</span>
      </Modal.Header>
      <Modal.Content style={{ display: 'flex', flexDirection: 'column' }}>
        <div className="space-evenly padding-bottom-2">
          <Radio label={intl.formatMessage({ id: 'share-story-with-a-group' })} checked />
          <Radio
            label={intl.formatMessage({ id: 'share-story-with-a-friend' })}
            checked={false}
            disabled
          />
        </div>
        <Form className="share-story-form" data-cy="share-story-form" onSubmit={share}>
          <div>
            {groupsUserCanShareWith && (
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  marginTop: '1em',
                  marginBottom: '1em',
                }}
              >
                <span style={{ paddingRight: '2rem' }}>
                  {intl.formatMessage({ id: 'share-story-with-a-group' })}
                </span>
                <select
                  data-cy="select-group"
                  defaultValue={shareTargetGroupId}
                  onChange={e => handleGroupChange(e)}
                >
                  {groupsUserCanShareWith.map(group => (
                    <option value={group.group_id} key={group.group_id}>
                      {group.groupName}
                    </option>
                  ))}
                </select>
              </div>
            )}
            <FormControl
              style={{ marginTop: '0.5em', marginBottom: '2rem' }}
              as="input"
              value={message}
              placeholder={intl.formatMessage({ id: 'write-a-message-for-the-receiver-optional' })}
              onChange={e => setMessage(e.target.value)}
            />
            <Button disabled={!shareTargetGroupId} type="submit">
              <FormattedMessage id="share-story" />
            </Button>
          </div>
        </Form>
      </Modal.Content>
    </Modal>
  )
}

export default ShareStory
