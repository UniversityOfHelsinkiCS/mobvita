import React, { useState, useEffect } from 'react'
import { Modal, Radio } from 'semantic-ui-react'
import { FormattedMessage, useIntl } from 'react-intl'
import { useDispatch, useSelector } from 'react-redux'
import { Button, FormControl, Form } from 'react-bootstrap'
import { shareStory } from 'Utilities/redux/shareReducer'
import { formatEmailList } from 'Utilities/common'

const ShareStory = ({ story, isOpen, setOpen }) => {
  const [shareTargetGroupId, setShareTargetGroupId] = useState(null)
  const [shareTargetUserEmails, setShareTargetUserEmails] = useState('')
  const [message, setMessage] = useState('')
  const [showOption, setShowOption] = useState('group')
  const [showSelfAddWarning, setShowSelfAddWarning] = useState(false)

  const EMAIL_MIN_LENGTH = 6

  const groupsUserCanShareWith = useSelector(({ groups }) =>
    groups.groups.filter(group => group.is_teaching)
  )
  const activeGroup = useSelector(({ user }) => user.data.user.last_selected_group)
  const ownEmail = useSelector(({ user }) => user.data.user.email)

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

    if (formatEmailList(shareTargetUserEmails).includes(ownEmail)) {
      setShowSelfAddWarning(true)
    } else {
      if (showOption === 'group') {
        dispatch(shareStory(story._id, [shareTargetGroupId], [], message))
      } else {
        dispatch(shareStory(story._id, [], formatEmailList(shareTargetUserEmails), message))
      }
      setMessage('')
      setOpen(false)
    }
  }

  const handleGroupChange = e => setShareTargetGroupId(e.target.value)

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
          <Radio
            name="group"
            label={intl.formatMessage({ id: 'share-story-with-a-group' })}
            checked={showOption === 'group'}
            onClick={() => setShowOption('group')}
          />
          <Radio
            name="user"
            label={intl.formatMessage({ id: 'share-story-with-a-user' })}
            checked={showOption === 'user'}
            onClick={() => setShowOption('user')}
          />
        </div>
        <Form className="share-story-form" data-cy="share-story-form" onSubmit={share}>
          <div>
            {showOption === 'group' && (
              <>
                {groupsUserCanShareWith.length > 0 ? (
                  <div>
                    <div
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        marginTop: '1em',
                        marginBottom: '1em',
                      }}
                    >
                      <span style={{ paddingRight: '2rem', fontWeight: 'bold' }}>
                        {intl.formatMessage({ id: 'Group' })}
                      </span>
                      <select data-cy="select-group" onChange={e => handleGroupChange(e)}>
                        {groupsUserCanShareWith.map(group => (
                          <option value={group.group_id} key={group.group_id}>
                            {group.groupName}
                          </option>
                        ))}
                      </select>
                    </div>
                    <FormControl
                      style={{ marginTop: '0.5em', marginBottom: '2rem' }}
                      as="input"
                      value={message}
                      placeholder={intl.formatMessage({
                        id: 'write-a-message-for-the-receiver-optional',
                      })}
                      onChange={e => setMessage(e.target.value)}
                    />
                    <Button disabled={!shareTargetGroupId} type="submit">
                      <FormattedMessage id="share-story" />
                    </Button>
                  </div>
                ) : (
                  <div
                    className="additional-info"
                    style={{ margin: '2em 0em', textAlign: 'center' }}
                  >
                    <FormattedMessage id="need-to-be-teacher-in-group-to-share" />
                  </div>
                )}
              </>
            )}
          </div>
        </Form>

        {showOption === 'user' && (
          <>
            <Form className="group-form" onSubmit={share}>
              <span className="sm-label">
                <FormattedMessage id="enter-email-address" />{' '}
                <FormattedMessage id="multiple-emails-separated-by-space" />
              </span>
              <FormControl
                as="textarea"
                value={shareTargetUserEmails}
                onChange={e => setShareTargetUserEmails(e.target.value)}
              />
              {showSelfAddWarning && (
                <div style={{ color: 'red', marginBottom: '1em' }}>
                  <FormattedMessage id="cant-share-story-with-yourself" />
                </div>
              )}
              <span className="sm-label" style={{ marginTop: '5em' }}>
                <FormattedMessage id="write-a-message-for-the-receiver-optional" />
              </span>
              <FormControl
                style={{ marginTop: '0.5em', marginBottom: '2rem' }}
                as="input"
                value={message}
                onChange={e => setMessage(e.target.value)}
              />
              <Button disabled={shareTargetUserEmails?.length < EMAIL_MIN_LENGTH} type="submit">
                <FormattedMessage id="share-story" />
              </Button>
            </Form>
          </>
        )}
      </Modal.Content>
    </Modal>
  )
}

export default ShareStory
