import React from 'react'
import { capitalize } from 'Utilities/common'
import { FormattedMessage } from 'react-intl'
import { Select } from 'semantic-ui-react'

const ToggleButton = ({ toggled, children, ...props }) => {
  const className = toggled ? 'library-toggle-button-chosen' : 'library-toggle-button'

  return (
    <button type="button" className={className} {...props}>
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
  groupDropdownOptions,
  savedGroupSelection,
  handleGroupChange,
  groupDropdownDisabled,
  ...props
}) => {
  // .sort() keeps the button order on Safari
  let buttons = Object.entries(values)
    .sort()
    .map(([key, val], index) => (
      <div className="library-tab">
        <ToggleButton
          key={key}
          onClick={() => onClick(key)}
          toggled={val}
          {...props}
          data-cy={`library-toggle-${index}`}
        >
          <FormattedMessage id={capitalize(key)} />
        </ToggleButton>
        {key === 'group' && !groupDropdownDisabled && (
          <Select
            value={savedGroupSelection}
            options={groupDropdownOptions}
            onChange={handleGroupChange}
            style={{ color: '#777', marginTop: '1em', width: '100%' }}
          />
        )}
      </div>
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
