import React from 'react'
import { capitalize } from 'Utilities/common'
import { FormattedMessage } from 'react-intl'
import { Button } from 'react-bootstrap'

// const buttonClass = toggled ? 'btn btn-secondary' : 'btn btn-info'
const ToggleButton = ({ toggled, children, ...props }) => {
  const className = toggled ? 'btn btn-toggle-on' : 'btn btn-toggle-off'
  return (
    <Button variant={className} style={{ margin: 0 }} {...props}>
      {children}
    </Button>
  )
}

const CheckboxGroup = ({
  values,
  onClick,
  additionalClass = '',
  dataCy,
  reverse = false,
  ...props
}) => {
  // .sort() keeps the button order on Safari
  let buttons = Object.entries(values)
    .sort()
    .map(([key, val]) => (
      <ToggleButton key={key} onClick={() => onClick(key)} toggled={val} {...props}>
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
