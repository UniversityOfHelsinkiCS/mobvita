import React, { Component } from 'react'
import { Container, Message } from 'semantic-ui-react'
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
      <Container style={{ margin: 10 }}>
        <Message color="red">
          <Message.Header>Something bad happened and we have been notified</Message.Header>
          <p>You can speed up the fixes by filling the form that opens from this button:</p>
          <button type="button" onClick={() => Sentry.showReportDialog({ eventId })}>
            Report error
          </button>
        </Message>
      </Container>
    )
  }
}
