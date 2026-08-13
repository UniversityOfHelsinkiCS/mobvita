import React, { Component } from 'react'
import { Box, Divider } from '@mui/material'
import { FormattedMessage } from 'react-intl'
import * as Sentry from '@sentry/react'
import AppButton from 'Components/AppButton'
import { images } from 'Utilities/common'
import { colors, font, shape } from 'Assets/mui_theme/designTokens'

export default class ErrorBoundary extends Component {
  constructor(props) {
    super(props)
    this.state = { hasError: false, eventId: undefined }
  }

  static getDerivedStateFromError() {
    return { hasError: true }
  }

  componentDidCatch(error, errorInfo) {
    Sentry.withScope(scope => {
      scope.setExtras(errorInfo)
      const eventId = Sentry.captureException(error)
      this.setState({ hasError: true, eventId })
    })
  }

  render() {
    const { hasError, eventId } = this.state
    const { children } = this.props
    if (!hasError) {
      return children
    }
    return (
      <Box
        sx={{
          minHeight: '70vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '2rem',
        }}
      >
        <Box
          data-cy="error-boundary-message"
          sx={{
            width: '100%',
            maxWidth: 560,
            boxSizing: 'border-box',
            padding: { xs: '32px 24px', sm: '40px' },
            backgroundColor: colors.card,
            borderRadius: `${shape.cardRadius}px`,
            boxShadow: '0 12px 40px rgba(0, 0, 0, 0.12)',
            fontFamily: font.family,
            color: colors.ink,
            textAlign: 'center',
          }}
        >
          <img src={images.alertCircle} alt="" width={44} height={44} />

          <Box
            component="h2"
            sx={{ fontSize: 22, fontWeight: 600, lineHeight: 1.35, margin: '16px 0 0' }}
          >
            <FormattedMessage id="an-error-has-occured" />
          </Box>

          <Box sx={{ fontSize: 15, lineHeight: 1.55, margin: '16px 0 24px' }}>
            <FormattedMessage id="you-can-help-us-fix" />
          </Box>

          <AppButton
            variant="primary"
            data-cy="error-boundary-report-button"
            onClick={() => Sentry.showReportDialog({ eventId })}
          >
            <FormattedMessage id="report-error" />
          </AppButton>

          <Box sx={{ fontSize: 13, color: colors.muted, marginTop: '12px' }}>
            <FormattedMessage id="please-write-in-any-language" />
          </Box>

          <Divider sx={{ my: '24px', borderColor: colors.border }} />

          <Box sx={{ fontSize: 15, fontWeight: 500 }}>
            <FormattedMessage id="next-please-refresh-page" />
          </Box>
        </Box>
      </Box>
    )
  }
}
