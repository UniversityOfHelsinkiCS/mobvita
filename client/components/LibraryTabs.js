import React from 'react'
import { capitalize } from 'Utilities/common'
import { FormattedMessage } from 'react-intl'

// Per-library label message ids that don't follow the default capitalize(key) convention.
const LABEL_MESSAGE_IDS = { essays: 'my-essays' }

const ToggleButton = ({ toggled, children, ...props }) => {
  const className = toggled ? 'library-toggle-button-chosen' : 'library-toggle-button'

  return (
    <button type="button" className={className} {...props}>
      {children}
    </button>
  )
}

// Sort entries by an explicit key order; keys not listed keep alphabetical order after the listed ones.
const byExplicitOrder =
  order =>
  ([keyA], [keyB]) => {
    const indexA = order.indexOf(keyA)
    const indexB = order.indexOf(keyB)
    if (indexA === -1 && indexB === -1) return keyA.localeCompare(keyB)
    if (indexA === -1) return 1
    if (indexB === -1) return -1
    return indexA - indexB
  }

const LibraryTabs = ({
  values,
  onClick,
  additionalStyle = {},
  additionalClass = '',
  dataCy,
  reverse = false,
  order,
}) => {
  // With an explicit `order` the entries are already in display order; otherwise .sort() keeps the
  // button order stable on Safari and callers may `reverse` it.
  const entries = order
    ? Object.entries(values).sort(byExplicitOrder(order))
    : Object.entries(values).sort()
  let buttons = entries.map(([key, val], index) => (
    <div key={key} className="library-tab">
      <ToggleButton onClick={() => onClick(key)} toggled={val} data-cy={`library-toggle-${index}`}>
        <FormattedMessage id={LABEL_MESSAGE_IDS[key] || capitalize(key)} />
      </ToggleButton>
    </div>
  ))
  // for having library buttons in right order
  if (reverse && !order) buttons = buttons.reverse()

  return (
    <div className={`library-tabs ${additionalClass}`} style={additionalStyle} data-cy={dataCy}>
      {buttons}
    </div>
  )
}

export default LibraryTabs
