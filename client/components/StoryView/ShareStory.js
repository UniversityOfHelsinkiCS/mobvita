import React, { useState, useEffect } from 'react'
import { FormControlLabel, RadioGroup } from '@mui/material'
import { FormattedMessage, useIntl } from 'react-intl'
import { useDispatch, useSelector, shallowEqual } from 'react-redux'
import AppButton from 'Components/AppButton'
import AppCheckbox from 'Components/ui/AppCheckbox'
import AppDialog from 'Components/ui/AppDialog'
import AppRadio from 'Components/ui/AppRadio'
import AppSelect from 'Components/ui/AppSelect'
import AppTextField from 'Components/ui/AppTextField'
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

  const groupsUserCanShareWith = useSelector(
    ({ groups }) => groups.groups.filter(group => group.is_teaching),
    shallowEqual
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

  const handleOptionSelect = option => {
    setShowOption(option)
    setMessage(
      intl.formatMessage({
        id: option === 'group' ? 'share-story-with-group-default' : 'share-story-with-user-default',
      })
    )
  }

  const groupOptions = groupsUserCanShareWith.map(group => ({
    value: group.group_id,
    label: group.groupName,
  }))

  return (
    <AppDialog
      open={isOpen}
      onClose={() => setOpen(false)}
      title={
        <>
          <span style={{ color: '#777' }}>
            <FormattedMessage id="Share" />:{' '}
          </span>
          <span style={{ color: '#000', opacity: '.4' }}> {story.shortTitle}</span>
        </>
      }
    >
      <RadioGroup
        row
        className="space-evenly padding-bottom-2"
        value={showOption}
        onChange={e => handleOptionSelect(e.target.value)}
      >
        <FormControlLabel
          value="group"
          control={<AppRadio />}
          label={intl.formatMessage({ id: 'share-story-with-a-group' })}
        />
        <FormControlLabel
          value="user"
          control={<AppRadio />}
          label={intl.formatMessage({ id: 'share-story-with-a-user' })}
        />
      </RadioGroup>

      <form className="share-story-form" data-cy="share-story-form" onSubmit={share}>
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
                    <div data-cy="select-group">
                      <AppSelect
                        variant="contrast-outline"
                        value={shareTargetGroupId}
                        options={groupOptions}
                        onChange={setShareTargetGroupId}
                      />
                    </div>
                    <FormControlLabel
                      sx={{ ml: '2rem' }}
                      control={
                        <AppCheckbox
                          checked={isHiddenStory}
                          onChange={() => setIsHiddenStory(!isHiddenStory)}
                        />
                      }
                      label={
                        (!story.flashcardsOnly &&
                          intl.formatMessage({ id: 'share-as-a-hidden-story' })) ||
                        intl.formatMessage({ id: 'share-as-a-hidden-flashcards' })
                      }
                    />
                  </div>
                  <span className="sm-label" style={{ marginTop: '5em' }}>
                    <FormattedMessage id="write-a-message-for-the-receiver-optional" />
                  </span>
                  <AppTextField
                    sx={{ mt: '0.5em', mb: '2rem' }}
                    value={message}
                    onChange={e => setMessage(e.target.value)}
                  />
                  <AppButton disabled={!shareTargetGroupId} type="submit">
                    <FormattedMessage id="Share" />
                  </AppButton>
                </div>
              ) : (
                <div className="additional-info" style={{ margin: '2em 0em', textAlign: 'center' }}>
                  <FormattedMessage id="need-to-be-teacher-in-group-to-share" />
                </div>
              )}
            </>
          )}
        </div>
      </form>

      {showOption === 'user' && (
        <form className="group-form" onSubmit={share}>
          <span className="sm-label">
            <FormattedMessage id="enter-email-address" />{' '}
            <FormattedMessage id="multiple-emails-separated-by-space" />
          </span>
          <AppTextField
            multiline
            rows={3}
            sx={{ mt: '0.5em', mb: '1.5em' }}
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
          <AppTextField
            sx={{ mt: '0.5em', mb: '2rem' }}
            value={message}
            onChange={e => setMessage(e.target.value)}
          />
          <AppButton disabled={shareTargetUserEmails?.length < EMAIL_MIN_LENGTH} type="submit">
            <FormattedMessage id="Share" />
          </AppButton>
        </form>
      )}
    </AppDialog>
  )
}

export default ShareStory
