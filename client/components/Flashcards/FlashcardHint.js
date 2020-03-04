import React, { useState } from 'react'
import { FormattedMessage } from 'react-intl'
import { Collapse } from 'react-bootstrap'
import { Icon } from 'semantic-ui-react'

const FlashcardHint = ({ hint }) => {
  const [open, setOpen] = useState(false)

  if (!hint) return null

  return (
    <>
      <button type="button" className="flashcard-hint-button" onClick={() => setOpen(!open)}>
        <FormattedMessage id="Hint" />
        {'  '}
        {open ? <Icon name="caret down" /> : <Icon name="caret left" />}
      </button>
      <Collapse in={open}>
        <p dangerouslySetInnerHTML={{ __html: hint }} />
      </Collapse>
    </>
  )
}

export default FlashcardHint
