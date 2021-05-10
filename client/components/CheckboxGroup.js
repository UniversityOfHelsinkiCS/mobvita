import React from 'react'
import { capitalize } from 'Utilities/common'
import { FormattedMessage } from 'react-intl'

const ToggleButton = ({ toggled, children, buttonStyle, ...props }) => {
  let className = ''

  if (buttonStyle === 'tab') {
    className = toggled ? 'library-toggle-button-chosen' : 'library-toggle-button'
  } else {
    className = 'btn btn-toggle-on'
  }

  return (
    <button type="button" className={className} style={{ margin: 0 }} {...props}>
      {children}
    </button>
  )
}

const CheckboxGroup = ({
  values,
  onClick,
  additionalClass = '',
  buttonStyle,
  dataCy,
  reverse = false,
  ...props
}) => {
  // .sort() keeps the button order on Safari
  let buttons = Object.entries(values)
    .sort()
    .map(([key, val]) => (
      <ToggleButton
        key={key}
        onClick={() => onClick(key)}
        toggled={val}
        buttonStyle={buttonStyle}
        {...props}
      >
        <FormattedMessage id={capitalize(key)} />
      </ToggleButton>
    ))
  // for having library buttons in right order
  if (reverse) buttons = buttons.reverse()

  return (
    <div className={`checkbox-group ${additionalClass}`} data-cy={dataCy}>
      {buttons}
    </div>
  )
}

export default CheckboxGroup
