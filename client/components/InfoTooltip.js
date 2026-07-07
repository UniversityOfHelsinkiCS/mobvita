import React from 'react'
import { styled } from '@mui/material/styles'
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined'
import CustomTooltip from 'Components/CustomTooltip'

/**
 * InfoTooltip — the app's standard "ⓘ" hint: a styled MUI info icon wrapped in CustomTooltip.
 * All icon styling is encapsulated in the styled component below, so callers don't pass style —
 * they only supply the tooltip content. Position the icon from the parent (wrap it) if needed.
 *
 * Info hints are `permanent` by default (shown even when the user disables tooltips in Settings).
 * For non-info triggers (buttons, links, plain text) use CustomTooltip directly.
 *
 * Props: keyId | title | values (tooltip content), placement (default "top"),
 * permanent (default true). Any other prop is forwarded to CustomTooltip.
 */
const StyledInfoIcon = styled(InfoOutlinedIcon)({
  // Explicit font-size so an ancestor's small font-size can't shrink the 1em icon.
  fontSize: '1.25rem',
  color: '#767676',
  cursor: 'help',
})

const InfoTooltip = ({ keyId, title, values, placement = 'top', permanent = true, ...rest }) => (
  <CustomTooltip
    keyId={keyId}
    title={title}
    values={values}
    placement={placement}
    permanent={permanent}
    {...rest}
  >
    <StyledInfoIcon />
  </CustomTooltip>
)

export default InfoTooltip
