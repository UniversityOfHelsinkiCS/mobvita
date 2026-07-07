import React from 'react'
import { useSelector } from 'react-redux'
import { Tooltip, tooltipClasses } from '@mui/material'
import { styled } from '@mui/material/styles'
import FormattedHTMLMessage from 'Components/FormattedHTMLMessage'

/**
 * CustomTooltip — a thin wrapper around MUI's Tooltip so the rest of the app doesn't depend on the
 * MUI API directly. All styling lives inside this component (via `styled`, no external CSS), and a
 * few convenience props are layered on top of the MUI API:
 *
 *   - keyId  : i18n message id, rendered through FormattedHTMLMessage so HTML in the translation
 *                (<ul>, <li>, <b> …) is supported. Takes precedence over `title`.
 *   - values   : interpolation values for the i18n message.
 *   - title    : raw node used when there is no `keyId`.
 *   - maxWidth : max width of the bubble (default 280).
 *   - permanent: when true the tooltip is always available, ignoring the user's global
 *                "show tooltips" setting. Non-permanent ("temporary") tooltips are only shown when
 *                that setting is enabled; when the user hasn't set it, they default to on for new
 *                users (is_new_user) and off otherwise.
 *
 * Every other prop (placement, arrow, enterDelay, disableInteractive, …) is forwarded to MUI.
 * If there is no resolvable title — or the tooltip is temporary and the setting is off — the
 * trigger is rendered without a tooltip wrapper.
 */
const StyledTooltip = styled(({ className, maxWidth, ...props }) => (
  <Tooltip {...props} classes={{ popper: className }} />
))(({ maxWidth = 280 }) => ({
  [`& .${tooltipClasses.tooltip}`]: {
    backgroundColor: '#fff',
    color: '#212529',
    fontSize: '1rem',
    lineHeight: 1.5,
    padding: '0.6em 0.8em',
    borderRadius: 8,
    maxWidth,
    boxShadow: '0 4px 14px rgba(0, 0, 0, 0.18)',
    '& ul': { margin: '0.3em 0 0', paddingLeft: '1.1em' },
    '& li': { marginBottom: '0.15em' },
    '& i': { opacity: 0.9 },
  },
  [`& .${tooltipClasses.arrow}`]: {
    color: '#fff',
  },
}))

const CustomTooltip = ({
  keyId,
  title,
  values,
  placement = 'top',
  arrow = true,
  maxWidth,
  permanent = false,
  children,
  ...rest
}) => {
  // Temporary tooltips obey the user's "show tooltips" setting. When the user hasn't set it yet,
  // default to showing them for new users (onboarding) and hiding them otherwise. Permanent
  // tooltips ignore all of this.
  const showTooltipsPref = useSelector(({ user }) => user?.data?.user?.show_tooltips)
  const isNewUser = useSelector(({ user }) => user?.data?.user?.is_new_user)
  const enabled = permanent || (showTooltipsPref ?? Boolean(isNewUser))

  const resolvedTitle = keyId ? (
    <FormattedHTMLMessage id={keyId} values={values} tagName="div" />
  ) : (
    title
  )

  if (!enabled || !resolvedTitle) return children

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

export default CustomTooltip
