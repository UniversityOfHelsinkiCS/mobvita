import React, { useState } from 'react'
import { answerAnnotation } from 'Utilities/redux/storiesReducer'
import { Form, TextArea, Dropdown, Checkbox } from 'semantic-ui-react'
import { Button } from 'react-bootstrap'
import { FormattedMessage, useIntl } from 'react-intl'
import { consistsOfOnlyWhitespace } from 'Utilities/common'

const AnswerAnnotationForm = () => {
  const intl = useIntl()
  const maxCharacters = 1000
  const [annotationText, setAnnotationText] = useState('')

  const handleTextChange = () => {

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