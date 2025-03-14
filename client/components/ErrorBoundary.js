import React, { Component } from 'react'
import { Container, Message } from 'semantic-ui-react'
import { FormattedMessage, FormattedHTMLMessage, useIntl } from 'react-intl'
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
        <Message color="red" style={{ display: block }}>
            <Message.Header>
                <FormattedMessage id={'An error has occurred in the system.  The develper team has been notified.'} />
            </Message.Header>
            <p>
                <FormattedMessage id={'You can help us fix the problem faster, by sending us a short description of it — in the form that opens with this button:'} />
            </p>
          <button type="button" onClick={() => Sentry.showReportDialog({ eventId })}>
            <FormattedMessage id={'Report error'} />
          </button>
            <p>
                <FormattedMessage id={'(Please write in any language that is convenient for you.)'} />
            </p>
            <Message.Header>
                <FormattedMessage id={'Next, please refresh the page, or click "Go back"'} />
            </Message.Header>
        </Message>
      </Container>
    )
  }
}
