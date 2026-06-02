import React, { Component } from 'react'
import { Container, Message } from 'semantic-ui-react'
import { FormattedMessage, useIntl } from 'react-intl';
import * as Sentry from '@sentry/react'

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
      <Container style={{ margin: 15 }}>
        <Message color="red" style={{ display: 'block' }}>
          <Message.Header>
            <FormattedMessage id="an-error-has-occured" />
          </Message.Header>
          <p>
            <FormattedMessage id="you-can-help-us-fix" />
          </p>
          <button type="button" onClick={() => Sentry.showReportDialog({ eventId })}>
            <FormattedMessage id="report-error" />
          </button>
          <p>
            <FormattedMessage id="please-write-in-any-language" />
          </p>
          <Message.Header>
            <FormattedMessage id="next-please-refresh-page" />
          </Message.Header>
        </Message>
      </Container>
    )
  }
}
