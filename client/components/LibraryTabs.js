import React from 'react'
import { capitalize } from 'Utilities/common'
import { FormattedMessage } from 'react-intl'

const ToggleButton = ({ toggled, children, ...props }) => {
  const className = toggled ? 'library-toggle-button-chosen' : 'library-toggle-button'

  return (
    <button type="button" className={className} style={{ margin: 0 }} {...props}>
      {children}
    </button>
  )
}

const LibraryTabs = ({
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
    <div className={`library-tabs ${additionalClass}`} data-cy={dataCy}>
      {buttons}
    </div>
  )
}

export default LibraryTabs
