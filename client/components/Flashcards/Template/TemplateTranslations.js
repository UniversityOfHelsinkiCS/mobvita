import React from 'react'
import { FormattedMessage, useIntl } from 'react-intl'
import { Form, Button } from 'react-bootstrap'
import Spinner from 'Components/Spinner'
import TemplateListItems from './TemplateListItems'

const TemplateTranslations = ({
  translations,
  setTranslations,
  translation,
  setTranslation,
  pending = false,
  ...props
}) => {
  const intl = useIntl()

  const handleTranslationChange = (e) => {
    setTranslation(e.target.value)
  }

  const handleTranslationSave = () => {
    if (translation) {
      setTranslations(translations.concat(translation))
      setTranslation('')
    }
  }

  const handleTranslationDelete = (selectedTranslation) => {
    setTranslations(translations.filter(t => t !== selectedTranslation))
  }

  const handleTranslationKeyDown = (e) => {
    if (e.key === 'Enter') {
      handleTranslationSave()
    }
  }

  return (
    <div className="flex-column auto-overflow">
      <label htmlFor="newTranslation" className="header-3 center padding-top-2">
        <FormattedMessage id="new-translations" />
      </label>
      <div className="auto-overflow margin-bottom-1">
        <div className="auto-overflow">
          {pending
            ? <Spinner />
            : (
              <ul>
                <TemplateListItems
                  values={translations}
                  handleDelete={handleTranslationDelete}
                  italics
                  {...props}
                />
              </ul>
            )
          }
        </div>
      </div>
      <Form.Control
        id="newTranslation"
        type="text"
        placeholder={intl.formatMessage({ id: 'type-new-translation' })}
        value={translation}
        onChange={handleTranslationChange}
        onKeyDown={handleTranslationKeyDown}
      />
      <Button
        variant="outline-primary"
        block
        className="flashcard-button margin-top-1 margin-bottom-3"
        onClick={handleTranslationSave}
      >
        <FormattedMessage id="save-the-translation" />
      </Button>
    </div>
  )
}

export default TemplateTranslations
