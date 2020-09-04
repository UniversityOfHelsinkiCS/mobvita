import React, { useState } from 'react'
import { FormattedMessage } from 'react-intl'
import { Collapse } from 'react-bootstrap'
import { flashcardColors } from 'Utilities/common'
import { Icon } from 'semantic-ui-react'

const FlashcardHint = ({ hints, stage }) => {
  const [open, setOpen] = useState(false)

  const { foreground } = flashcardColors

  if (!hints || !hints[0]) return <div className="flashcard-hint" />

  const hintList = () =>
    [...new Set(hints)].map(h => <li key={h} dangerouslySetInnerHTML={{ __html: h }} />)

  return (
    <div className="flashcard-hint">
      <Collapse in={open} style={{ overflow: 'auto' }}>
        <ul>{hintList()}</ul>
      </Collapse>
      <button
        type="button"
        className="flashcard-blended-input flashcard-hint-button"
        onClick={() => setOpen(!open)}
        style={{ color: foreground[stage] }}
      >
        <FormattedMessage id="Hint" />
        {'  '}
        {open ? <Icon name="caret up" /> : <Icon name="caret left" />}
      </button>
    </div>
  )
}

export default FlashcardHint
