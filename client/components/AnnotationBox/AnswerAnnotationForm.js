import React, { useState, useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { answerAnnotation } from 'Utilities/redux/storiesReducer'
import { setFocusedSpan } from 'Utilities/redux/annotationsReducer'
import { useParams } from 'react-router-dom'
import AppButton from 'Components/AppButton'
import AppTextField from 'Components/ui/AppTextField'
import { FormattedMessage, useIntl } from 'react-intl'
import { consistsOfOnlyWhitespace, getMode } from 'Utilities/common'

const AnswerAnnotationForm = ({ focusedSpan, spanAnnotations, setShowAnswerForm }) => {
  const intl = useIntl()
  const dispatch = useDispatch()
  const { id: storyId } = useParams()
  const mode = getMode()
  const maxCharacters = 1000
  const [annotationText, setAnnotationText] = useState('')


  const handleTextChange = e => {
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

    if (updatedSpan) {
      dispatch(setFocusedSpan(updatedSpan))
      setShowAnswerForm(false)
    }
  }, [spanAnnotations])

  return (
    <div style={{ marginTop: '.5rem' }}>
      <form>
        <AppTextField
          multiline
          rows={7}
          value={annotationText}
          onChange={handleTextChange}
          placeholder={intl.formatMessage({ id: 'reply-note-form-placeholder' })}
          autoFocus
          inputProps={{ maxLength: maxCharacters, 'data-cy': 'annotation-text-field' }}
          sx={{ mt: 0, mb: '.5rem' }}
        />
        <AppButton
          variant="primary"
          size="sm"
          style={{ marginLeft: '1em' }}
          onClick={handleAnswerAnnotation}
          disabled={annotationText?.length < 1 || consistsOfOnlyWhitespace(annotationText)}
          data-cy="answer-annotation-button"
        >
          <FormattedMessage id="Save" />
        </AppButton>
      </form>
    </div>
  )
}

export default AnswerAnnotationForm
