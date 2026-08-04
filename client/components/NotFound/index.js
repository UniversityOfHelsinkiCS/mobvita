import React from 'react'
import { Link } from 'react-router-dom'
import { Box } from '@mui/material'
import { FormattedMessage } from 'react-intl'
import AppButton from 'Components/AppButton'
import { colors, font } from 'Assets/mui_theme/designTokens'

/**
 * NotFound (/404) — standalone 404 page in the 2026 design (cream card).
 *
 * Deliberately separate from the app's ErrorBoundary fallback: this is a normal "page doesn't exist
 * / not available" screen, not a crash handler. Also used to hide dev-only routes (e.g. /design)
 * from users without access — they get a plain 404 rather than a redirect that reveals the route.
 */
const NotFound = () => (
  <div
    className="justify-center"
    style={{ display: 'flex', alignItems: 'center', minHeight: '70vh', padding: '1em' }}
  >
    <Box
      sx={{
        backgroundColor: colors.card,
        borderRadius: '30px',
        padding: { xs: '2em 1.5em', sm: '3em 3.5em' },
        boxShadow: '0 2px 12px rgba(0, 0, 0, 0.06)',
        textAlign: 'center',
        maxWidth: 460,
        marginTop: '1.5em',
        fontFamily: font.family,
        color: colors.ink,
      }}
    >
      <div style={{ fontFamily: font.family, fontSize: 84, fontWeight: 600, color: colors.green, lineHeight: 1 }}>
        404
      </div>
      <h1 style={{ fontFamily: font.family, fontSize: 24, fontWeight: 500, color: colors.ink, margin: '0.6em 0 0.3em' }}>
        <FormattedMessage id="page-not-found-title" defaultMessage="Page not found" />
      </h1>
      <p style={{ fontFamily: font.family, color: colors.muted, lineHeight: 1.5, margin: '0 0 1.75em' }}>
        <FormattedMessage
          id="page-not-found-text"
          defaultMessage="The page you're looking for doesn't exist or isn't available."
        />
      </p>
      <Link to="/home" style={{ textDecoration: 'none' }}>
        <AppButton variant="tan">
          <FormattedMessage id="Home" defaultMessage="Home" />
        </AppButton>
      </Link>
    </Box>
  </div>
)

export default NotFound
