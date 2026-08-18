import React from 'react'
import { FormattedMessage, useIntl } from 'react-intl'
import AppTextField from 'Components/ui/AppTextField'
import AppButton from 'Components/AppButton'
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
    <div className="flashcard-template-section">
      <label htmlFor="hints" className="flashcard-form-title">
        <FormattedMessage id="Hints" />
      </label>
      <div className="flashcard-form-list">
        <ul>
          <TemplateListItems values={hints} handleDelete={handleHintDelete} />
        </ul>
      </div>
      <div className="flashcard-template-input">
        <AppTextField
          id="hints"
          placeholder={intl.formatMessage({ id: 'type-new-hint' })}
          value={hint}
          onChange={handleHintChange}
          onKeyDown={handleHintKeyDown}
          inputRef={hintRef}
        />
      </div>
      <AppButton variant="secondary" className="flashcard-form-button" onClick={handleHintSave}>
        <FormattedMessage id="save-the-hint" />
      </AppButton>
    </div>
  )
}

export default TemplateHints
