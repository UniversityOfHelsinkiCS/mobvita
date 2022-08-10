import React from 'react'
import { useDispatch } from 'react-redux'
import { Form, TextArea, Dropdown } from 'semantic-ui-react'
import { Button } from 'react-bootstrap'
import { FormattedMessage, useIntl } from 'react-intl'
import { setAnnotationFormVisibility } from 'Utilities/redux/annotationsReducer'
import { getCategoryColor } from 'Utilities/common'

const AnnotationForm = ({
  annotationText,
  setAnnotationText,
  handleAnnotationSave,
  maxCharacters,
  charactersLeft,
  setCharactersLeft,
  getCategoryColor,
  category,
  setCategory,
  annotationName,
  setAnnotationName
}) => {
  const intl = useIntl()
  const dispatch = useDispatch()

  const handleTextChange = e => {
    setCharactersLeft(maxCharacters - e.target.value.length)
    setAnnotationText(e.target.value)
  }

  const dropDownMenuText = category ? (
    <FormattedMessage id={`notes-${category}`} />
  ) : (
    <FormattedMessage id="notes-Grammar" />
  )

  const consistsOfOnlyWhitespace = text => {
    if (text.match(/^\s+$/g)) return true
    return false
  }

  const categoryOptions = [
    {
      key: '0',
      text: <FormattedMessage id="notes-Grammar" />,
      value: 'Grammar',
    },
    {
      key: '1',
      text: <FormattedMessage id="notes-Phrases" />,
      value: 'Phrases',
    },
    {
      key: '2',
      text: <FormattedMessage id="notes-Vocabulary" />,
      value: 'Vocabulary',
    },
  ]

  return (
    <div>
      <Form>
        <div className="row-flex" style={{ marginBottom: '.5em' }}>
          <Form.Input
            className="annotation-name-input"
            type="text"
            value={annotationName}
            onChange={(_, { value }) => setAnnotationName(value)}
            placeholder={intl.formatMessage({ id: 'annotation-name' })}
          />
        </div>
        <div className="row-flex" style={{ marginBottom: '.5em' }}>
          <span style={{ marginRight: '.5em' }}>
            <FormattedMessage id="Category" />:{' '}
          </span>
          <Dropdown
            text={dropDownMenuText}
            selection
            fluid
            options={categoryOptions}
            onChange={(_, { value }) => setCategory(value)}
          />
        </div>
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
        disabled={annotationText?.length < 1 || consistsOfOnlyWhitespace(annotationText)}
        data-cy="save-annotation-button"
      >
        <FormattedMessage id="Save" />
      </Button>
    </div>
  )
}

export default AnnotationForm
