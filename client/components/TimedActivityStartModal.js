import FormattedHTMLMessage from 'Components/FormattedHTMLMessage'
import React from 'react'
import AppButton from 'Components/AppButton'
import AppDialog from 'Components/ui/AppDialog'
import { FormattedMessage } from 'react-intl'

const TimedActivityStartModal = ({ open, setOpen, activity, onBackClick, onStart }) => {
  const handleStartClick = () => {
    if (onStart) onStart()
    setOpen(false)
  }

  const handleBackClick = () => {
    onBackClick()
    setOpen(false)
  }

  return (
    <AppDialog open={open} onClose={handleBackClick} title={<FormattedMessage id={activity} />}>
      <div className="mb-lg">
        <FormattedHTMLMessage id={`${activity}-info-text`} />
      </div>
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'stretch',
          gap: '0.75em',
          marginTop: '1em',
        }}
      >
        <AppButton data-cy="start-timed-activity" size="lg" block onClick={handleStartClick}>
          <FormattedMessage id="start" />
        </AppButton>
        <AppButton variant="secondary" size="lg" block onClick={handleBackClick}>
          <FormattedMessage id="go-back" />
        </AppButton>
      </div>
    </AppDialog>
  )
}

export default TimedActivityStartModal
