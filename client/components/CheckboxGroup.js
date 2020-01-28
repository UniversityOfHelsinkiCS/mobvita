import React from 'react'
import { capitalize } from 'Utilities/common'
import { FormattedMessage } from 'react-intl'

// const buttonClass = toggled ? 'btn btn-secondary' : 'btn btn-info'
const ToggleButton = ({ toggled, children, ...rest }) => {
  const className = toggled ? 'btn btn-toggle-on' : 'btn btn-toggle-off'
  return (
    <button
      {...rest}
      type="button"
      className={className}
    >
      {children}
    </button>
  )
}


const CheckboxGroup = ({ values, onClick }) => (
  <div style={{ display: 'flex', flexWrap: 'wrap' }}>{
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
