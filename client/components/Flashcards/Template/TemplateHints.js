import React from 'react'
import { FormattedMessage, useIntl } from 'react-intl'
import { Form, Button } from 'react-bootstrap'
import TemplateListItems from './TemplateListItems'

const TemplateHints = ({ hints, setHints, hint, setHint }) => {
  const intl = useIntl()

  const handleHintChange = (e) => {
    setHint(e.target.value)
  }

  const handleHintSave = () => {
    if (hint) {
      setHints(hints.concat(hint))
      setHint('')
    }
  }

  const handleHintDelete = (selectedHint) => {
    setHints(hints.filter(h => h !== selectedHint))
  }

  return (
    <div className="flex-column padding-bottom-1 auto-overflow">
      <label htmlFor="hints" className="header-3 center">
        <FormattedMessage id="hints-for-this-flashcard" />
      </label>
      <div className="auto-overflow">
        <ul>
          <TemplateListItems values={hints} handleDelete={handleHintDelete} />
        </ul>
      </div>
      <Form.Control
        className="flex-static-size margin-top-1"
        id="hints"
        as="textarea"
        placeholder={intl.formatMessage({ id: 'type-new-hint' })}
        value={hint}
        onChange={handleHintChange}
      />
      <Button
        variant="outline-primary"
        className="flashcard-button margin-top-1"
        onClick={handleHintSave}
      >
        <FormattedMessage id="save-the-hint" />
      </Button>
    </div>
  )
}

export default TemplateHints
