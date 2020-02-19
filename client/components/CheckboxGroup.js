import React from 'react'
import { capitalize } from 'Utilities/common'
import { FormattedMessage } from 'react-intl'
import { Button } from 'react-bootstrap'


// const buttonClass = toggled ? 'btn btn-secondary' : 'btn btn-info'
const ToggleButton = ({ toggled, children, ...rest }) => {
  const className = toggled ? 'btn btn-toggle-on' : 'btn btn-toggle-off'
  return (
    <Button
      {...rest}
      variant={className}
      size="sm"
    >
      {children}
    </Button>
  )
}


const CheckboxGroup = ({ values, onClick }) => (
  <div style={{ marginTop: 'auto' }} className="checkboxGroup">{
    Object.entries(values).sort().map(([key, val]) => (
      <ToggleButton
        key={key}
        onClick={onClick(key)}
        toggled={val}
      >
        <FormattedMessage id={capitalize(key)} />
      </ToggleButton>
    ))}
  </div>
)

export default CheckboxGroup
