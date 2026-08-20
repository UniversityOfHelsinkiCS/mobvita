// eslint-disable-next-line no-unused-vars
import React from 'react'
import { Tooltip, tooltipClasses } from '@mui/material'
import { styled } from '@mui/material/styles'
import FormattedHTMLMessage from 'Components/FormattedHTMLMessage'
import { colors } from 'Assets/mui_theme/designTokens'

/**
 * AppTooltip — the design-system tooltip (2026). A white, softly-rounded bubble with an arrow,
 * Geologica ink text and a soft drop shadow.
 *
 * Built on MUI's Tooltip and modelled on `CustomTooltip`'s API, but purely presentational — it does
 * NOT read the user's global "show tooltips" setting (that behaviour stays in CustomTooltip). Use
 * AppTooltip for always-available design-system tooltips; all styling lives here (no external CSS).
 *
 *   keyId    : i18n message id, rendered through FormattedHTMLMessage so HTML in the translation
 *              (<b>, <ul>, <li> …) is supported. Takes precedence over `title`.
 *   values   : interpolation values for the i18n message.
 *   title    : raw node used when there is no `keyId`.
 *   maxWidth : max width of the bubble (default 260).
 *
 * Every other prop (placement, arrow, enterDelay, disableInteractive, …) is forwarded to MUI. If
 * there is no resolvable title the trigger is rendered without a tooltip wrapper.
 */
const StyledTooltip = styled(
  ({
    className,
    // maxWidth is a style-only prop (read by the styled callback below); strip it so it isn't
    // forwarded onto the DOM popper.
    // eslint-disable-next-line no-unused-vars
    maxWidth,
    ...props
  }) => <Tooltip {...props} classes={{ popper: className }} />,
)(({ maxWidth = 260 }) => ({
  [`& .${tooltipClasses.tooltip}`]: {
    backgroundColor: '#ffffff',
    color: colors.ink,
    fontSize: 14,
    fontWeight: 500,
    lineHeight: 1.45,
    padding: '10px 16px',
    borderRadius: 20,
    maxWidth,
    // drop-shadow (not box-shadow) so the shadow follows the whole shape, including the arrow,
    // which keeps the arrow visible against light backgrounds.
    filter: 'drop-shadow(0 4px 14px rgba(45, 44, 42, 0.18))',
    '& ul': { margin: '0.3em 0 0', paddingLeft: '1.1em' },
    '& li': { marginBottom: '0.15em' },
    '& b': { fontWeight: 700 },
  },
  [`& .${tooltipClasses.arrow}`]: {
    color: '#ffffff',
  },
}))

const AppTooltip = ({
  keyId,
  title,
  values,
  placement = 'top',
  arrow = true,
  maxWidth,
  children,
  ...rest
}) => {
  const resolvedTitle = keyId ? (
    <FormattedHTMLMessage id={keyId} values={values} tagName="div" />
  ) : (
    title
  )

  if (!resolvedTitle) return children

  return (
    <StyledTooltip
      title={resolvedTitle}
      placement={placement}
      arrow={arrow}
      maxWidth={maxWidth}
      {...rest}
    >
      {children}
    </StyledTooltip>
  )
}

export default AppTooltip
