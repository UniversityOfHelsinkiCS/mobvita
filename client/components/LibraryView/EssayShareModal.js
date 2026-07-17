import React, { useState } from 'react'
import { Modal } from 'semantic-ui-react'
import { FormattedMessage } from 'react-intl'
import { useDispatch, useSelector } from 'react-redux'
import { Button, FormControl, Form } from 'react-bootstrap'
import { capitalize, formatEmailList, learningLanguageSelector } from 'Utilities/common'
import { getWritingEssayId, shareWritingEssay } from 'Utilities/redux/writingCorrectionReducer'

const EMAIL_MIN_LENGTH = 6

// Share one saved essay with a list of user emails (POST /essays/{id}/share). Mirrors ShareStory's
// "share with a user" flow — the essay API only takes emails (no groups/message).
const EssayShareModal = ({ open, onClose, essay }) => {
  const dispatch = useDispatch()
  const learningLanguage = useSelector(learningLanguageSelector)
  const ownEmail = useSelector(({ user }) => user.data?.user?.email)

  const [shareTargetUserEmails, setShareTargetUserEmails] = useState('')
  const [showSelfAddWarning, setShowSelfAddWarning] = useState(false)

  const essayId = getWritingEssayId(essay)
  const title = essay?.title || essay?.sentences?.[0]?.original_text || ''

  const close = () => {
    setShareTargetUserEmails('')
    setShowSelfAddWarning(false)
    onClose()
  }

  const share = event => {
    event.preventDefault()
    const emails = formatEmailList(shareTargetUserEmails)

    if (ownEmail && emails.includes(ownEmail.toLowerCase())) {
      setShowSelfAddWarning(true)
      return
    }
    if (!emails.length || !essayId || !learningLanguage) return

    dispatch(shareWritingEssay(capitalize(learningLanguage), essayId, emails))
    close()
  }

  return (
    <Modal dimmer="inverted" closeIcon open={open} onClose={close}>
      <Modal.Header>
        <span style={{ color: '#777' }}>
          <FormattedMessage id="Share" />:{' '}
        </span>
        <span style={{ color: '#000', opacity: '.4' }}> {title}</span>
      </Modal.Header>
      <Modal.Content style={{ display: 'flex', flexDirection: 'column' }}>
        <Form className="group-form" onSubmit={share}>
          <span className="sm-label">
            <FormattedMessage id="enter-email-address" />{' '}
            <FormattedMessage id="multiple-emails-separated-by-space" />
          </span>
          <FormControl
            as="textarea"
            value={shareTargetUserEmails}
            onChange={event => setShareTargetUserEmails(event.target.value)}
            data-cy="essay-share-emails"
          />
          {showSelfAddWarning && (
            <div style={{ color: 'red', marginBottom: '1em' }}>
              <FormattedMessage id="cant-share-essay-with-yourself" />
            </div>
          )}
          <Button
            disabled={shareTargetUserEmails?.length < EMAIL_MIN_LENGTH}
            type="submit"
            data-cy="essay-share-confirm"
            style={{ marginTop: '1em' }}
          >
            <FormattedMessage id="Share" />
          </Button>
        </Form>
      </Modal.Content>
    </Modal>
  )
}

export default EssayShareModal
