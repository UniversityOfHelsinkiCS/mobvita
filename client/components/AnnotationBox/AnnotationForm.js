import React, { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useLocation } from 'react-router-dom'
import { Box, FormControlLabel } from '@mui/material'
import AppButton from 'Components/AppButton'
import AppCheckbox from 'Components/ui/AppCheckbox'
import AppSelect from 'Components/ui/AppSelect'
import AppTextField from 'Components/ui/AppTextField'
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
  publicStory }) => {
  const location = useLocation()
  const intl = useIntl()

  const inGroupStory = location.pathname.includes('group')
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
      label: <FormattedMessage id="notes-None" />,
      value: 'None' },
    {
      label: <FormattedMessage id="notes-Grammar" />,
      value: 'Grammar' },
    {
      label: <FormattedMessage id="notes-Phrases" />,
      value: 'Phrases' },
    {
      label: <FormattedMessage id="notes-Vocabulary" />,
      value: 'Vocabulary' },
  ]

  return (
    <div>
      <form>
        <div className="row-flex" style={{ marginBottom: '.5em' }}>
          <span style={{ marginRight: '.5em' }}>
            <FormattedMessage id="Category" />:{' '}
          </span>
          <Box sx={{ flexGrow: 1 }} data-cy="annotation-category-select">
            <AppSelect
              variant="contrast-outline"
              value={category}
              placeholder={dropDownMenuText}
              options={categoryOptions}
              onChange={setCategory}
              matchTriggerWidth
            />
          </Box>
        </div>
        {((inGroupStory && is_teacher) || sharedStory || (!publicStory && is_teacher )) && (
          <div style={{ marginTop: '.25rem', marginBottom: '.25rem' }}>
            <FormControlLabel
              control={
                <AppCheckbox
                  sx={{ p: 0, mr: '0.5em' }}
                  checked={publicNote}
                  onChange={() => setPublicNote(!publicNote)}
                  inputProps={{ 'data-cy': 'annotation-public-note-checkbox' }}
                />
              }
              label={intl.formatMessage({ id: 'public-note-checkbox' })}
            />
          </div>
        )}
        <AppTextField
          multiline
          rows={6}
          value={annotationText}
          onChange={handleTextChange}
          placeholder={intl.formatMessage({ id: 'write-your-note-here' })}
          autoFocus
          inputProps={{ maxLength: maxCharacters, 'data-cy': 'annotation-text-field' }}
          sx={{ marginTop: '0rem', marginBottom: '.5rem' }}
        />
      </form>
      <AppButton
        variant="outline-secondary"
        size="sm"
        onClick={() => dispatch(setAnnotationFormVisibility(false))}
        data-cy="cancel-annotation-button"
      >
        <FormattedMessage id="Cancel" />
      </AppButton>
      <AppButton
        variant="primary"
        size="sm"
        onClick={() => handleAnnotationSave(publicNote)}
        style={{ marginLeft: '1em' }}
        disabled={annotationText?.length < 1 || consistsOfOnlyWhitespace(annotationText)}
        data-cy="save-annotation-button"
      >
        <FormattedMessage id="Save" />
      </AppButton>
    </div>
  )
}

export default AnnotationForm
