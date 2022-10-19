import React, { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { answerAnnotation } from 'Utilities/redux/storiesReducer'
import { setFocusedSpan } from 'Utilities/redux/annotationsReducer'
import { useParams } from 'react-router-dom'
import { Form, TextArea } from 'semantic-ui-react'
import { Button } from 'react-bootstrap'
import { FormattedMessage, useIntl } from 'react-intl'
import { consistsOfOnlyWhitespace, getMode } from 'Utilities/common'

const AnswerAnnotationForm = ({ focusedSpan, spanAnnotations, setShowAnswerForm }) => {
  const intl = useIntl()
  const dispatch = useDispatch()
  const { id: storyId } = useParams()
  const mode = getMode()
  const maxCharacters = 1000
  const [annotationText, setAnnotationText] = useState('')
  const { type, message } = useSelector(
    ({ notification }) => notification
  )
  // const [charactersLeft, setCharactersLeft] = useState(maxCharacters)

  const handleTextChange = e => {
    // setCharactersLeft(maxCharacters - e.target.value.length)
    setAnnotationText(e.target.value)
  }

  const handleAnswerAnnotation = () => {
    dispatch(
      answerAnnotation(
        storyId,
        focusedSpan.startId,
        focusedSpan.endId,
        annotationText.trim(),
        mode,
        focusedSpan.annotationTexts[0].thread_id
      )
    )
  }

  useEffect(() => {
    const updatedSpan = spanAnnotations.find(
      span =>
        span.annotationString === focusedSpan.annotationString &&
        span.annotationTexts.length !== focusedSpan.annotationTexts.length
    )
    // console.log('updated no ', updatedSpan)
    if (updatedSpan) {
      // setShowAnswerForm(false)
      dispatch(setFocusedSpan(updatedSpan))
    }
  }, [spanAnnotations])

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
