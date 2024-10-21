import React, { useState, useEffect } from 'react'
import { Modal, Radio } from 'semantic-ui-react'
import { FormattedMessage, useIntl } from 'react-intl'
import { useDispatch, useSelector } from 'react-redux'
import { Button, FormControl, Form } from 'react-bootstrap'
import { Checkbox } from 'semantic-ui-react'
import { shareStory } from 'Utilities/redux/shareReducer'
import { formatEmailList } from 'Utilities/common'

const ShareStory = ({ story, isOpen, setOpen }) => {
  const intl = useIntl()
  const dispatch = useDispatch()

  const [shareTargetGroupId, setShareTargetGroupId] = useState(null)
  const [shareTargetUserEmails, setShareTargetUserEmails] = useState('')
  const [showOption, setShowOption] = useState('group')
  const [showSelfAddWarning, setShowSelfAddWarning] = useState(false)
  const [message, setMessage] = useState(
    intl.formatMessage({ id: 'share-story-with-group-default' })
  )
  const [isHiddenStory, setIsHiddenStory] = useState(false)

  const EMAIL_MIN_LENGTH = 6
  const ownEmail = useSelector(({ user }) => user.data.user.email)

  const groupsUserCanShareWith = useSelector(({ groups }) =>
    groups.groups.filter(group => group.is_teaching)
  )

  useEffect(() => {
    if (groupsUserCanShareWith.length > 0) {
      setShareTargetGroupId(groupsUserCanShareWith[0].group_id)
    }
  }, [])

  const share = event => {
    event.preventDefault()

    if (formatEmailList(shareTargetUserEmails).includes(ownEmail)) {
      setShowSelfAddWarning(true)
    } else {
      if (showOption === 'group') {
        dispatch(shareStory(story._id, [shareTargetGroupId], [], message, isHiddenStory))
      } else {
        dispatch(shareStory(story._id, [], formatEmailList(shareTargetUserEmails), message, false))
      }
      setMessage('')
      setOpen(false)
    }
  }

  const handleGroupOptionSelect = () => {
    setShowOption('group')
    setMessage(intl.formatMessage({ id: 'share-story-with-group-default' }))
  }

  const handleUserOptionSelect = () => {
    setShowOption('user')
    setMessage(intl.formatMessage({ id: 'share-story-with-user-default' }))
  }

  const handleGroupChange = e => setShareTargetGroupId(e.target.value)

  return (
    <Modal dimmer="inverted" closeIcon open={isOpen} onClose={() => setOpen(false)}>
      <Modal.Header>
        <span style={{ color: '#777' }}>
          <FormattedMessage id="Share" />:{' '}
        </span>
        <span style={{ color: '#000', opacity: '.4' }}> {story.shortTitle}</span>
      </Modal.Header>
      <Modal.Content style={{ display: 'flex', flexDirection: 'column' }}>
        <div className="space-evenly padding-bottom-2">
          <Radio
            name="group"
            label={intl.formatMessage({ id: 'share-story-with-a-group' })}
            checked={showOption === 'group'}
            onClick={handleGroupOptionSelect}
          />
          <Radio
            name="user"
            label={intl.formatMessage({ id: 'share-story-with-a-user' })}
            checked={showOption === 'user'}
            onClick={handleUserOptionSelect}
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
                        marginTop: '2em',
                        marginBottom: '2em',
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
                      <Checkbox
                        label={
                          !story.flashcardsOnly && intl.formatMessage({ id: 'share-as-a-hidden-story' }) || 
                          intl.formatMessage({ id: 'share-as-a-hidden-flashcards' })
                        }
                        checked={isHiddenStory}
                        onChange={() => setIsHiddenStory(!isHiddenStory)}
                        style={{ marginLeft: '2rem' }}
                      />
                    </div>
                    <span className="sm-label" style={{ marginTop: '5em' }}>
                      <FormattedMessage id="write-a-message-for-the-receiver-optional" />
                    </span>
                    <FormControl
                      style={{ marginTop: '0.5em', marginBottom: '2rem' }}
                      as="input"
                      value={message}
                      onChange={e => setMessage(e.target.value)}
                    />
                    <Button disabled={!shareTargetGroupId} type="submit">
                      <FormattedMessage id="Share" />
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
                <FormattedMessage id="Share" />
              </Button>
            </Form>
          </>
        )}
      </Modal.Content>
    </Modal>
  )
}

export default ShareStory
