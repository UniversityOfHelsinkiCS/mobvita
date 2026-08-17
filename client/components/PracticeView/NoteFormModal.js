import React, { useState, useEffect } from 'react'
import FormControlLabel from '@mui/material/FormControlLabel'
import AppDialog from 'Components/ui/AppDialog'
import AppTextField from 'Components/ui/AppTextField'
import AppCheckbox from 'Components/ui/AppCheckbox'
import AppButton from 'Components/AppButton'
import { FormattedMessage, useIntl } from 'react-intl'
import { consistsOfOnlyWhitespace } from 'Utilities/common'
import Spinner from 'Components/Spinner'

const NoteFormModal = ({ open, onClose, onSubmit, initialText = '', initialPublic = false, isEdit = false, loading = false, canMakePublic = false }) => {
  const intl = useIntl()
  const maxCharacters = 1000
  const [text, setText] = useState(initialText)
  const [isPublic, setIsPublic] = useState(initialPublic)

  useEffect(() => {
    if (open) {
      setText(initialText)
      setIsPublic(initialPublic)
    }
  }, [open, initialText, initialPublic])

  const saveDisabled = text?.length < 1 || consistsOfOnlyWhitespace(text)

  const handleSave = () => {
    if (saveDisabled || loading) return
    onSubmit(text.trim(), canMakePublic ? isPublic : false)
  }

  const handleClose = () => {
    if (loading) return
    onClose()
  }

  return (
    <AppDialog
      open={open}
      onClose={handleClose}
      data-cy="note-form-modal"
      title={
        <span className="bold">
          <FormattedMessage
            id={isEdit ? 'edit-note' : 'create-a-note'}
            defaultMessage={isEdit ? 'Edit note' : 'Add a note'}
          />
        </span>
      }
    >
      <form>
        <AppTextField
          multiline
          rows={7}
          value={text}
          onChange={e => setText(e.target.value)}
          placeholder={intl.formatMessage({ id: 'write-your-note-here' })}
          autoFocus
          inputProps={{ maxLength: maxCharacters, 'data-cy': 'note-text-field' }}
          sx={{ marginTop: 0, marginBottom: '.5rem' }}
        />
        {canMakePublic && (
          <div style={{ marginTop: '.25rem', marginBottom: '.75rem' }}>
            <FormControlLabel
              label={intl.formatMessage({ id: 'public-note-checkbox' })}
              control={
                <AppCheckbox
                  checked={isPublic}
                  onChange={() => setIsPublic(prev => !prev)}
                  sx={{ p: 0, mr: '0.5em' }}
                  slotProps={{ input: { 'data-cy': 'note-public-checkbox' } }}
                />
              }
            />
          </div>
        )}
      </form>
      <AppButton
        variant="outline-secondary"
        size="sm"
        onClick={handleClose}
        disabled={loading}
        data-cy="note-cancel-button"
      >
        <FormattedMessage id="Cancel" />
      </AppButton>
      <AppButton
        variant="primary"
        size="sm"
        onClick={handleSave}
        style={{ marginLeft: '1em', minWidth: '4.5em' }}
        disabled={saveDisabled || loading}
        data-cy="save-note-button"
      >
        {loading ? <Spinner inline /> : <FormattedMessage id="Save" />}
      </AppButton>
    </AppDialog>
  )
}

export default NoteFormModal
