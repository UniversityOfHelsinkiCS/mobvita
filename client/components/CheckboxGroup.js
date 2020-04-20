import React from 'react'
import { capitalize } from 'Utilities/common'
import { FormattedMessage } from 'react-intl'
import { Button } from 'react-bootstrap'


// const buttonClass = toggled ? 'btn btn-secondary' : 'btn btn-info'
const ToggleButton = ({ toggled, children, ...props }) => {
  const className = toggled ? 'btn btn-toggle-on' : 'btn btn-toggle-off'
  return (
    <Button
      variant={className}
      style={{ margin: 0 }}
      {...props}
    >
      {children}
    </Button>
  )
}


const CheckboxGroup = ({ values, onClick, additionalClass = '', dataCy, ...props }) => (
  <div className={`checkbox-group ${additionalClass}`} data-cy={dataCy}>{
    Object.entries(values).map(([key, val]) => (
      <ToggleButton
        key={key}
        onClick={() => onClick(key)}
        toggled={val}
        {...props}
      >
        <FormattedMessage id={capitalize(key)} />
      </ToggleButton>
    ))}
  </div>
)

export default CheckboxGroup
