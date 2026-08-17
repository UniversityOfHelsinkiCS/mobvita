// eslint-disable-next-line no-unused-vars
import React from 'react'
import { useSelector } from 'react-redux'
import FormattedHTMLMessage from 'Components/FormattedHTMLMessage'
import AppTooltip from 'Components/ui/AppTooltip'

/**
 * CustomTooltip — the app tooltip. It layers the user's global "show tooltips" setting on top
 * of the design-system `AppTooltip` (which owns all styling/rendering — white bubble, arrow,
 * Geologica text). A few convenience props:
 *
 *   - keyId  : i18n message id, rendered through FormattedHTMLMessage so HTML in the
 *                translation (<ul>, <li>, <b> …) is supported. Takes precedence over `title`.
 *   - values   : interpolation values for the i18n message.
 *   - title    : raw node used when there is no `keyId`.
 *   - permanent: when true the tooltip is always available, ignoring the user's global "show
 *                tooltips" setting. Non-permanent ("temporary") tooltips are only shown when that
 *                setting is enabled; when the user hasn't set it, they default to on for new users
 *                (is_new_user) and off otherwise.
 *
 * Every other prop (placement, arrow, maxWidth, enterDelay, …) is forwarded to AppTooltip. If there
 * is no resolvable title — or the tooltip is temporary and the setting is off — the trigger is
 * rendered without a tooltip wrapper.
 */
const CustomTooltip = ({ keyId, title, values, permanent = false, children, ...rest }) => {
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
    <AppTooltip title={resolvedTitle} {...rest}>
      {children}
    </AppTooltip>
  )
}

export default CustomTooltip
