import React, { useState } from 'react'
import { FormattedMessage } from 'react-intl'
import { Collapse } from 'react-bootstrap'
import { Icon } from 'semantic-ui-react'

const FlashcardHint = ({ hint: hints }) => {
  const [open, setOpen] = useState(false)

  if (!hints || !hints[0]) return null

  const hintList = () => hints.map(h => (
    <li key={h} dangerouslySetInnerHTML={{ __html: h }} />
  ))

  return (
    <div className="flashcard-hint">
      <Collapse in={open} style={{ overflow: 'auto' }}>
        <ul>
          {hintList()}
        </ul>
      </Collapse>
      <button
        type="button"
        className="flashcard-blended-input flashcard-hint-button"
        onClick={() => setOpen(!open)}
      >
        <FormattedMessage id="Hint" />
        {'  '}
        {open ? <Icon name="caret up" /> : <Icon name="caret left" />}
      </button>
    </div>
  )
}

export default FlashcardHint
