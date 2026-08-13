import FormattedHTMLMessage from 'Components/FormattedHTMLMessage';
import React, { useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { Box, MenuItem, Select } from '@mui/material'
import { FormattedMessage, useIntl } from 'react-intl';
import AppButton from 'Components/AppButton'
import AppDialog from 'Components/ui/AppDialog'
import AppTextField from 'Components/ui/AppTextField'
import { importStoriesFromGroup } from 'Utilities/redux/groupsReducer'
import { getAllStories } from 'Utilities/redux/storiesReducer'

const ImportStoryModal = ({ open, setOpen, groupId }) => {
  const dispatch = useDispatch()
  const intl = useIntl()
  const { groups } = useSelector(({ groups }) => groups)
  const [selectedGroups, setSelectedGroups] = useState([])
  const [message, setMessage] = useState('')
  const group = groups.find(group => group.group_id === groupId)

  const options = groups.filter(group => group.group_id !== groupId).map(
    group => ({key: group.group_id, text: group.groupName, value: group.group_id}))
  const submitGroupImport = async () => {
    // console.log(selectedGroups)
    // console.log(message)
    await dispatch(importStoriesFromGroup(groupId, selectedGroups, message))
    dispatch(
      getAllStories(group.language, {
        sort_by: 'date',
        order: -1,
      })
    )
    setOpen(false)
    setSelectedGroups([])
    setMessage('')
  }

  return (
    <AppDialog
      onClose={() => setOpen(false)}
      open={open}
      data-cy="import-story-modal"
      title={
        <>
          <FormattedMessage id="import-story" /> : {group.groupName}
        </>
      }
    >
      <Box sx={{ display: 'flex', flexDirection: 'column', height: '260px' }}>
        <h2 style={{ fontSize: '17px', fontWeight: '550' }}>
          <FormattedMessage id="import-story-label" />
        </h2>
        <FormattedHTMLMessage id="import-story-description" />
        <Select
          multiple
          fullWidth
          displayEmpty
          defaultValue={[]}
          renderValue={selected =>
            selected.length === 0
              ? intl.formatMessage({ id: 'import-from' })
              : options
                  .filter(option => selected.includes(option.value))
                  .map(option => option.text)
                  .join(', ')
          }
          onChange={e => setSelectedGroups(e.target.value)}
          SelectDisplayProps={{ 'data-cy': 'import-story-group-select' }}
          style={{ marginTop: '1em' }}
        >
          {options.map(option => (
            <MenuItem key={option.key} value={option.value}>
              {option.text}
            </MenuItem>
          ))}
        </Select>
        <span style={{marginTop: '1em', display: 'flex', alignItems: 'center'}}>
            <label style={{marginRight: '2em', fontWeight: 'bold'}}><FormattedMessage id="import-story-message" /></label>
            <AppTextField
              type="text"
              fullWidth={false}
              inputProps={{ 'data-cy': 'import-story-message-input' }}
              onChange={(e)=> setMessage(e.target.value)}
            />
        </span>
      </Box>
      <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75em' }}>
        <AppButton
          onClick={submitGroupImport}
          disabled={selectedGroups.length === 0}
          data-cy="import-story-confirm-button"
        >
            <FormattedMessage id="import" />
        </AppButton>
        <AppButton
          style={{ marginLeft: '1em' }}
          onClick={() => {
            setOpen(false)
          }}
          variant="secondary"
          data-cy="import-story-cancel-button"
        >
          <FormattedMessage id="cancel" />
        </AppButton>
      </Box>
    </AppDialog>
  )
}

export default ImportStoryModal
