import React, { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useHistory } from 'react-router'
import { Form, TextArea, Dropdown, Checkbox } from 'semantic-ui-react'
import { Button } from 'react-bootstrap'
import { FormattedMessage, useIntl } from 'react-intl'
import { setAnnotationFormVisibility } from 'Utilities/redux/annotationsReducer'
import { consistsOfOnlyWhitespace } from 'Utilities/common'

const AnnotationForm = ({
  annotationText,
  setAnnotationText,
  handleAnnotationSave,
  maxCharacters,
  setCharactersLeft,
  category,
  setCategory,
  sharedStory,
  publicStory,
}) => {
  const history = useHistory()
  const intl = useIntl()
  const inGroupStory = history.location.pathname.includes('group')
  const { is_teacher } = useSelector(({ user }) => user.data.user)
  const dispatch = useDispatch()
  const handleTextChange = e => {
    setCharactersLeft(maxCharacters - e.target.value.length)
    setAnnotationText(e.target.value)
  }
  const [publicNote, setPublicNote] = useState(
    inGroupStory || sharedStory || (!publicStory && is_teacher)
  )

  const dropDownMenuText = category ? (
    <FormattedMessage id={`notes-${category}`} />
  ) : (
    <FormattedMessage id="notes-Grammar" />
  )

  const categoryOptions = [
    {
      key: '0',
      text: <FormattedMessage id="notes-None" />,
      value: 'None',
    },
    {
      key: '1',
      text: <FormattedMessage id="notes-Grammar" />,
      value: 'Grammar',
    },
    {
      key: '2',
      text: <FormattedMessage id="notes-Phrases" />,
      value: 'Phrases',
    },
    {
      key: '3',
      text: <FormattedMessage id="notes-Vocabulary" />,
      value: 'Vocabulary',
    },
  ]

  return (
    <div>
      <Form>
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
        {((inGroupStory && is_teacher) || sharedStory || (!publicStory && is_teacher )) && (
          <div style={{ marginTop: '.25rem', marginBottom: '.25rem' }}>
            <Checkbox
              label={intl.formatMessage({ id: 'public-note-checkbox' })}
              checked={publicNote}
              onChange={() => setPublicNote(!publicNote)}
            />
          </div>
        )}
        <TextArea
          value={annotationText}
          onChange={handleTextChange}
          placeholder={intl.formatMessage({ id: 'write-your-note-here' })}
          maxLength={maxCharacters}
          style={{ marginTop: '0rem', minHeight: '10em', marginBottom: '.5rem' }}
          autoFocus
          data-cy="annotation-text-field"
        />
      </Form>
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
        onClick={() => handleAnnotationSave(publicNote)}
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
