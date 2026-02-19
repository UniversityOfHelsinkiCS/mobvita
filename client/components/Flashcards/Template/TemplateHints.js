import React from 'react'
import { FormattedMessage, useIntl } from 'react-intl'
import { Form, Button } from 'react-bootstrap'
import TemplateListItems from './TemplateListItems'

const TemplateHints = ({ hints, setHints, hint, setHint, hintRef }) => {
  const intl = useIntl()

  const handleHintChange = e => {
    setHint(e.target.value)
  }

  const handleHintSave = () => {
    if (hint) {
      setHints(prevHints => [...prevHints, hint])
      setHint('')
    }
  }

  const handleHintDelete = hintIdx => {
    setHints(prevHints => prevHints.filter((_, idx) => idx !== hintIdx))
  }

  const handleHintKeyDown = e => {
    if (e.key === 'Enter') {
      e.preventDefault()
      handleHintSave()
    }

    if (e.key === 'Escape') {
      e.preventDefault()
      setHint('')
    }
  }

  return (
    <div className="flex-col pb-lg auto-overflow">
      <label htmlFor="hints" className="header-3 justify-center">
        <FormattedMessage id="hints-for-this-flashcard" />
      </label>
      <div className="auto-overflow">
        <ul>
          <TemplateListItems values={hints} handleDelete={handleHintDelete} />
        </ul>
      </div>
      <Form.Control
        className="flex-static-size mt-sm"
        id="hints"
        as="textarea"
        placeholder={intl.formatMessage({ id: 'type-new-hint' })}
        value={hint}
        onChange={handleHintChange}
        onKeyDown={handleHintKeyDown}
        ref={hintRef}
      />
      <Button
        variant="primary"
        className="flashcard-template-button mt-sm"
        onClick={handleHintSave}
      >
        <FormattedMessage id="save-the-hint" />
      </Button>
    </div>
  )
}

export default TemplateHints
