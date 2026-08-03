import React, {useState} from 'react'
import * as Sentry from '@sentry/react'

// Small helper component to send a test error to Sentry.
// Usage: <TestSentryTrigger message="My test error" />

const Bomb = ({ explode }) => {
  if (explode) throw new Error('Render-time error')
  return <div>Safe</div>
}

const TestSentryTrigger = ({ message = 'Test Sentry error', extra = {}, dsn = null }) => {
  const [explode, setExplode] = useState(false)
  const ensureSentry = (dsnToUse) => {
    try {
      const client = Sentry.getCurrentHub && Sentry.getCurrentHub().getClient()
      if (!client && dsnToUse) {
        Sentry.init({ dsn: dsnToUse })
      }
    } catch (e) {
      // ignore
    }
  }

  const handleSend = () => {
    // If a dsn prop is provided, ensure Sentry is initialized for this test
    if (dsn) ensureSentry(dsn)

    try {
      throw new Error(message)
    } catch (err) {
      // Attach optional extra context
      if (extra && Object.keys(extra).length > 0) {
        Sentry.withScope(scope => {
          Object.entries(extra).forEach(([k, v]) => scope.setExtra(k, v))
          Sentry.captureException(err)
        })
      } else {
        Sentry.captureException(err)
      }
    }
  }

  return (    
    <div style={{ padding: '0.5rem' }}>
      
        <Bomb explode={explode} />
      
      <button data-cy="send-sentry-btn" type="button" onClick={handleSend}>
        Send test error to Sentry
      </button>
      <button onClick={() => setExplode(true)}>
        Explode
      </button>
    </div>
  )
}

export default TestSentryTrigger
