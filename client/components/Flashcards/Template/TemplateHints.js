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
    <div className="flex-col pb-lg auto-overflow">
      <label htmlFor="hints" className="header-2 justify-center bold">
        <FormattedMessage id="Hints" />
      </label>
      <div className="auto-overflow">
        <ul>
          <TemplateListItems values={hints} handleDelete={handleHintDelete} />
        </ul>
      </div>
      <div className="flex-static-size mt-sm">
        <AppTextField
          multiline
          id="hints"
          placeholder={intl.formatMessage({ id: 'type-new-hint' })}
          value={hint}
          onChange={handleHintChange}
          onKeyDown={handleHintKeyDown}
          inputRef={hintRef}
        />
      </div>
      <AppButton
        variant="secondary"
        className="flashcard-template-button"
        style={{ marginTop: '0.75em' }}
        onClick={handleHintSave}
      >
        <FormattedMessage id="save-the-hint" />
      </AppButton>
    </div>
  )
}

export default TemplateHints
