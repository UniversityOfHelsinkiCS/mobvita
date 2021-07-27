import React from 'react'
import { capitalize } from 'Utilities/common'
import { FormattedMessage } from 'react-intl'
import { Icon } from 'semantic-ui-react'
import { Button } from 'react-bootstrap'

const ToggleButton = ({ children, ...props }) => (
  <Button className="btn btn-toggle-on" variant="primary" {...props}>
    {children}
  </Button>
)

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
    .map(([key, _]) => (
      <ToggleButton key={key} onClick={() => onClick(key)} {...props}>
        <div style={{ position: 'relative' }}>
          <Icon name={key === 'private' ? 'user' : 'group'} size="big" />
          <div className="practice-now-overlay-icon">
            <Icon name={key === 'public' ? 'lock open' : 'lock'} color="yellow" size="large" />
          </div>
        </div>
        <span
          style={{
            fontSize: '1.2rem',
            letterSpacing: '.05em',
            fontWeight: 'bold',
          }}
        >
          <FormattedMessage id={capitalize(key)} />
        </span>
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
