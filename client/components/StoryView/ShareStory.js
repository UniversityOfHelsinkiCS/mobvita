import React, { useEffect, useState } from 'react'
import { Box, FormControlLabel, RadioGroup } from '@mui/material'
import { FormattedMessage, useIntl } from 'react-intl'
import { useDispatch, useSelector, shallowEqual } from 'react-redux'
import AppButton from 'Components/AppButton'
import AppCheckbox from 'Components/ui/AppCheckbox'
import AppDialog from 'Components/ui/AppDialog'
import AppRadio from 'Components/ui/AppRadio'
import AppSelect from 'Components/ui/AppSelect'
import AppTextField from 'Components/ui/AppTextField'
import { colors } from 'Assets/mui_theme/designTokens'
import { shareStory } from 'Utilities/redux/shareReducer'
import { formatEmailList } from 'Utilities/common'

// Control labels, matching the menu rows the selects open (16px / 500); the checkbox reads as body
// text next to them, so it keeps the regular weight.
const RADIO_LABEL_SX = {
  m: 0,
  '& .MuiFormControlLabel-label': { fontSize: 16, fontWeight: 500, whiteSpace: 'nowrap' },
}
const CHECKBOX_LABEL_SX = {
  m: 0,
  alignSelf: 'flex-start',
  '& .MuiFormControlLabel-label': { fontSize: 16, fontWeight: 400 },
}

// The caption above a field: muted and small, inset to line up with the pill's own padding.
const FIELD_LABEL_STYLE = { color: colors.muted, fontSize: 12, paddingLeft: 10 }

const ShareStory = ({ story, isOpen, setOpen }) => {
  const intl = useIntl()
  const dispatch = useDispatch()

  const [shareTargetGroupId, setShareTargetGroupId] = useState(null)
  const [shareTargetUserEmails, setShareTargetUserEmails] = useState('')
  const [showOption, setShowOption] = useState('group')
  const [showSelfAddWarning, setShowSelfAddWarning] = useState(false)
  const [message, setMessage] = useState('')
  const [isHiddenStory, setIsHiddenStory] = useState(false)

  const EMAIL_MIN_LENGTH = 6
  const ownEmail = useSelector(({ user }) => user.data.user.email)

  const groupsUserCanShareWith = useSelector(
    ({ groups }) => groups.groups.filter(group => group.is_teaching),
    shallowEqual
  )

  // The dialog lives inside the story card, so it keeps its state after closing — a reopened
  // dialog would otherwise still hold the last message typed into it.
  useEffect(() => {
    if (!isOpen) return
    setMessage('')
    // No group preselected: sharing to a group stays a deliberate choice.
    setShareTargetGroupId(null)
  }, [isOpen])

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

  // Only the target changes; whatever the teacher has typed stays as it is.
  const handleOptionSelect = option => setShowOption(option)

  const groupOptions = groupsUserCanShareWith.map(group => ({
    value: group.group_id,
    label: group.groupName,
  }))

  const canShareWithAGroup = groupsUserCanShareWith.length > 0
  const shareIsPossible =
    showOption === 'group'
      ? canShareWithAGroup && !!shareTargetGroupId
      : shareTargetUserEmails?.length >= EMAIL_MIN_LENGTH

  const hiddenStoryLabel = story.flashcardsOnly
    ? 'share-as-a-hidden-flashcards'
    : 'share-as-a-hidden-story'

  return (
    <AppDialog
      open={isOpen}
      onClose={() => setOpen(false)}
      maxWidth="xs"
      fullWidth
      // Fills the width up to 540px, and shrinks with the screen below that.
      paperSx={{ maxWidth: 540 }}
      // No heading: the story's own title is the only caption the dialog needs.
      title={story.shortTitle}
      titleSx={{ px: '60px', pt: '40px', color: colors.muted, fontSize: 22, fontWeight: 400 }}
      contentSx={{ px: '60px', pb: '40px' }}
      closeSx={{ right: 24, top: 24 }}
    >
      <form className="share-story-form" data-cy="share-story-form" onSubmit={share}>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: '1.25em' }}>
          <RadioGroup
            row
            value={showOption}
            onChange={e => handleOptionSelect(e.target.value)}
            sx={{ justifyContent: 'space-between', flexWrap: 'nowrap' }}
          >
            <FormControlLabel
              value="group"
              control={<AppRadio />}
              label={intl.formatMessage({ id: 'share-story-with-a-group' })}
              sx={RADIO_LABEL_SX}
            />
            <FormControlLabel
              value="user"
              control={<AppRadio />}
              label={intl.formatMessage({ id: 'share-story-with-a-user' })}
              sx={RADIO_LABEL_SX}
            />
          </RadioGroup>

          {showOption === 'group' &&
            (canShareWithAGroup ? (
              <>
                <div data-cy="select-group">
                  <AppSelect
                    variant="contrast-outline"
                    placeholder={intl.formatMessage({ id: 'select-group' })}
                    minWidth="100%"
                    matchTriggerWidth
                    value={shareTargetGroupId}
                    options={groupOptions}
                    onChange={setShareTargetGroupId}
                  />
                </div>
                <FormControlLabel
                  sx={CHECKBOX_LABEL_SX}
                  control={
                    <AppCheckbox
                      checked={isHiddenStory}
                      onChange={() => setIsHiddenStory(!isHiddenStory)}
                    />
                  }
                  label={intl.formatMessage({ id: hiddenStoryLabel })}
                />
              </>
            ) : (
              <div className="additional-info" style={{ textAlign: 'center' }}>
                <FormattedMessage id="need-to-be-teacher-in-group-to-share" />
              </div>
            ))}

          {showOption === 'user' && (
            <div>
              <span className="sm-label">
                <FormattedMessage id="enter-email-address" />{' '}
                <FormattedMessage id="multiple-emails-separated-by-space" />
              </span>
              <AppTextField
                multiline
                rows={3}
                sx={{ mt: '0.5em', '& .MuiOutlinedInput-root': { borderRadius: '12px' } }}
                value={shareTargetUserEmails}
                onChange={e => setShareTargetUserEmails(e.target.value)}
              />
              {showSelfAddWarning && (
                <div style={{ color: colors.error, marginTop: '0.5em' }}>
                  <FormattedMessage id="cant-share-story-with-yourself" />
                </div>
              )}
            </div>
          )}

          {(showOption === 'user' || canShareWithAGroup) && (
            <div>
              <span style={FIELD_LABEL_STYLE}>
                <FormattedMessage id="write-a-message-for-the-receiver-optional" />
              </span>
              <AppTextField
                sx={{ mt: '0.5em' }}
                value={message}
                onChange={e => setMessage(e.target.value)}
              />
            </div>
          )}

          <AppButton type="submit" disabled={!shareIsPossible} sx={{ width: '100%', height: 36 }}>
            <FormattedMessage id="Share" />
          </AppButton>
        </Box>
      </form>
    </AppDialog>
  )
}

export default ShareStory
