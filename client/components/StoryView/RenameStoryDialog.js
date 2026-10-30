import React, { useEffect, useState } from 'react'
import { useDispatch } from 'react-redux'
import { FormattedMessage, useIntl } from 'react-intl'
import { Box } from '@mui/material'
import AppButton from 'Components/AppButton'
import AppDialog from 'Components/ui/AppDialog'
import AppTextField from 'Components/ui/AppTextField'
import { renameStory } from 'Utilities/redux/storiesReducer'

const RenameStoryDialog = ({ story, open, onClose }) => {
  const intl = useIntl()
  const dispatch = useDispatch()
  const [title, setTitle] = useState(story?.title || '')

  useEffect(() => {
    if (open) setTitle(story?.title || '')
  }, [open, story?.title])

  const trimmed = title.trim()
  const unchanged = trimmed === (story?.title || '').trim()

  const handleSubmit = event => {
    event.preventDefault()
    if (!trimmed || unchanged) {
      onClose()
      return
    }

    dispatch(renameStory(story._id, trimmed))
    onClose()
  }

  return (
    <AppDialog
      open={open}
      onClose={onClose}
      maxWidth="xs"
      title={<FormattedMessage id="rename-story" />}
      data-cy="rename-story-dialog"
    >
      <form onSubmit={handleSubmit}>
        <AppTextField
          autoFocus
          fullWidth
          value={title}
          onChange={event => setTitle(event.target.value)}
          placeholder={intl.formatMessage({ id: 'story-title' })}
          inputProps={{ 'data-cy': 'rename-story-input', maxLength: 200 }}
        />
        <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75em', mt: '1.5em' }}>
          <AppButton variant="contrast-outline" onClick={onClose}>
            <FormattedMessage id="Cancel" />
          </AppButton>
          <AppButton type="submit" disabled={!trimmed} data-cy="rename-story-save">
            <FormattedMessage id="Save" />
          </AppButton>
        </Box>
      </form>
    </AppDialog>
  )
}

export default RenameStoryDialog
