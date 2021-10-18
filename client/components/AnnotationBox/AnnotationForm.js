import React from 'react'
import { useDispatch } from 'react-redux'
import { Form, TextArea } from 'semantic-ui-react'
import { Button } from 'react-bootstrap'
import { FormattedMessage, useIntl } from 'react-intl'
import { setAnnotationFormVisibility } from 'Utilities/redux/annotationsReducer'

const AnnotationForm = ({
  annotationText,
  setAnnotationText,
  handleAnnotationSave,
  maxCharacters,
  charactersLeft,
  setCharactersLeft,
}) => {
  const intl = useIntl()
  const dispatch = useDispatch()

  const handleTextChange = e => {
    setCharactersLeft(maxCharacters - e.target.value.length)
    setAnnotationText(e.target.value)
  }

  const consistsOfOnlyWhitespace = text => {
    if (text.match(/^\s+$/g)) return true
    return false
  }

  return (
    <div>
      <Form>
        <TextArea
          value={annotationText}
          onChange={handleTextChange}
          placeholder={intl.formatMessage({ id: 'write-your-note-here' })}
          maxLength={maxCharacters}
          style={{ marginTop: '0rem', minHeight: '10em' }}
          autoFocus
          data-cy="annotation-text-field"
        />
      </Form>
      <div className="bold" style={{ margin: '.75rem 0rem', fontSize: '.85rem' }}>
        <FormattedMessage id="characters-left" />
        {` ${charactersLeft}`}
      </div>
      <Button
        variant="outline-secondary"
        size="sm"
        onClick={() => dispatch(setAnnotationFormVisibility(false))}
      >
        <FormattedMessage id="Cancel" />
      </Button>
      <Button
        variant="primary"
        size="sm"
        onClick={handleAnnotationSave}
        style={{ marginLeft: '1em' }}
        disabled={annotationText.length < 1 || consistsOfOnlyWhitespace(annotationText)}
        data-cy="save-annotation-button"
      >
        <FormattedMessage id="Save" />
      </Button>
    </div>
  )
}

export default AnnotationForm
