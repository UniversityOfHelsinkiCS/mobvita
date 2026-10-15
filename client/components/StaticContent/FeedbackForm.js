import React from 'react'
import ButtonBase from '@mui/material/ButtonBase'
import { FormattedMessage, useIntl } from 'react-intl'
import AppButton from 'Components/AppButton'
import AppIcon from 'Components/ui/AppIcon'
import AppTextField from 'Components/ui/AppTextField'
import { pillButtonSx } from 'Components/ui/sx'
import { images } from 'Utilities/common'
import { colors } from 'Assets/mui_theme/designTokens'
import './FeedbackForm.scss'

export const BUG_REPORT_MAX_CHARACTERS = 1000

// The three choices, each with its icon, icon colour and the label shown above the message box.
export const FEEDBACK_TOPICS = [
  { key: 'contact', icon: images.mail05, color: colors.feedbackContact },
  { key: 'bug', icon: images.bug, color: colors.feedbackBug },
  { key: 'suggestion', icon: images.bulbEmpty, color: colors.feedbackSuggestion },
]

// Presentational feedback form: pick contact / bug / suggestion, then write the message.
// A bug also shows the old report dialog's characters-left count.
const FeedbackForm = ({
  topic,
  message,
  onTopicChange,
  onMessageChange,
  onSubmit,
  sendDisabled,
}) => {
  const intl = useIntl()

  // Stops the native submit so the container decides where the message goes.
  const handleSubmit = e => {
    e.preventDefault()
    onSubmit()
  }

  return (
    <form className="feedback-form" onSubmit={handleSubmit}>
      <div className="feedback-section">
        <div className="feedback-text">
          <FormattedMessage id="feedback-intro" />
        </div>
        <div className="feedback-choices">
          {FEEDBACK_TOPICS.map(({ key, icon, color }) => (
            <ButtonBase
              key={key}
              aria-pressed={topic === key}
              data-cy={`feedback-topic-${key}`}
              onClick={() => onTopicChange(key)}
              className="feedback-choice"
            >
              <AppIcon src={icon} size={36} color={color} />
              <FormattedMessage id={`feedback-option-${key}`} />
            </ButtonBase>
          ))}
        </div>
      </div>

      {topic && (
        <div className="feedback-message-section">
          <div className="feedback-text">
            <FormattedMessage id={`feedback-describe-${topic}`} />
          </div>
          <AppTextField
            multiline
            minRows={4}
            value={message}
            onChange={e => onMessageChange(e.target.value)}
            placeholder={intl.formatMessage({ id: 'write-here' })}
            inputProps={{
              'data-cy': 'feedback-message',
              maxLength: topic === 'bug' ? BUG_REPORT_MAX_CHARACTERS : undefined,
            }}
            className="feedback-message"
          />
          {topic === 'bug' && (
            <div className="feedback-text">
              <FormattedMessage id="characters-left" />
              {` ${BUG_REPORT_MAX_CHARACTERS - message.length}`}
            </div>
          )}
        </div>
      )}

      {topic && (
        <div className="feedback-actions">
          <AppButton
            type="submit"
            disabled={!message.trim() || sendDisabled}
            data-cy="feedback-send"
            className="feedback-send"
            sx={pillButtonSx()}
          >
            <FormattedMessage id="send-feedback" />
          </AppButton>
        </div>
      )}
    </form>
  )
}

export default FeedbackForm
