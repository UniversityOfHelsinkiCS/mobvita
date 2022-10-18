import React, { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { answerAnnotation } from 'Utilities/redux/storiesReducer'
import { useParams } from 'react-router-dom'
import { Form, TextArea, Dropdown, Checkbox } from 'semantic-ui-react'
import { Button } from 'react-bootstrap'
import { FormattedMessage, useIntl } from 'react-intl'
import { consistsOfOnlyWhitespace, getMode } from 'Utilities/common'

const AnswerAnnotationForm = ({ focusedSpan }) => {
  const intl = useIntl()
  const dispatch = useDispatch()
  const { id: storyId } = useParams()
  const mode = getMode()
  const maxCharacters = 1000
  const [annotationText, setAnnotationText] = useState('')
  // const [charactersLeft, setCharactersLeft] = useState(maxCharacters)

  const handleTextChange = e => {
    // setCharactersLeft(maxCharacters - e.target.value.length)
    setAnnotationText(e.target.value)
  }

  const handleAnswerAnnotation = () => {
    dispatch(
      answerAnnotation(storyId, focusedSpan.startId, focusedSpan.endId, annotationText.trim(), mode)
    )
  }

  return (
    <div style={{ marginTop: '.5rem' }}>
      <Form>
        <TextArea
          value={annotationText}
          onChange={handleTextChange}
          placeholder={intl.formatMessage({ id: 'reply-note-form-placeholder' })}
          maxLength={maxCharacters}
          style={{ marginTop: '0rem', minHeight: '10em', marginBottom: '.5rem' }}
          autoFocus
          data-cy="annotation-text-field"
        />
        <Button
          variant="primary"
          size="sm"
          style={{ marginLeft: '1em' }}
          onClick={handleAnswerAnnotation}
          disabled={annotationText?.length < 1 || consistsOfOnlyWhitespace(annotationText)}
          data-cy="answer-annotation-button"
        >
          <FormattedMessage id="Save" />
        </Button>
      </Form>
    </div>
  )
}

export default AnswerAnnotationForm
