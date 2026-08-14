// eslint-disable-next-line no-unused-vars
import React from 'react'
import AppButton from 'Components/AppButton'
import { FormattedMessage } from 'react-intl'
import { colors } from 'Assets/mui_theme/designTokens'

/**
 * ToggleButton — the grammar-level selector buttons (2026 design). Level buttons are white cards
 * that fill green when selected; the recommended level gets a dark ink outline. The "Custom"
 * trigger is a dark ink pill.
 */
const ToggleButton = ({
  handleClick,
  name,
  width = '100%',
  height = '100%',
  active,
  level,
  recommended,
  className,
}) => {
  if (name === 'custom') {
    return (
      <AppButton
        className={`toggle-button ${className || ''}`}
        variant={active ? 'primary' : 'secondary'}
        onClick={handleClick}
        sx={{ width, height, fontSize: 16, fontWeight: 600 }}
        data-cy="lesson-toggle-button-custom"
      >
        <FormattedMessage id="open-custom-grammar-topics-modal" />
      </AppButton>
    )
  }

  return (
    <AppButton
      className={`toggle-button ${className || ''}`}
      variant={active ? 'primary' : 'card'}
      onClick={handleClick}
      sx={{
        width,
        height,
        borderRadius: '12px',
        fontSize: 18,
        fontWeight: 700,
        // The recommended level is outlined in ink (replaces the old caret marker).
        ...(recommended && !active
          ? { border: `2px solid ${colors.ink}`, '&:hover': { borderColor: colors.ink } }
          : {}),
      }}
      data-cy={`lesson-toggle-button-${name?.replace(/\s+/g, '-')}`}
    >
      {level}
    </AppButton>
  )
}

export default ToggleButton
