import React, { useState } from 'react'
import { FormattedMessage } from 'react-intl'
import { Collapse } from 'react-bootstrap'
import { Icon } from 'semantic-ui-react'

const FlashcardHint = ({ hint }) => {
  const [open, setOpen] = useState(false)

  if (!hint) return null

  return (
    <div className="flashcard-hint">
      <Collapse in={open} style={{ overflow: 'auto' }}>
        <p dangerouslySetInnerHTML={{ __html: hint }} />
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
