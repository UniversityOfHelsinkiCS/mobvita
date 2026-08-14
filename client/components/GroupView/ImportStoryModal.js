import FormattedHTMLMessage from 'Components/FormattedHTMLMessage'
// eslint-disable-next-line no-unused-vars
import React, { useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { Select, MenuItem, ListItemText, OutlinedInput } from '@mui/material'
import { FormattedMessage, useIntl } from 'react-intl'
import AppButton from 'Components/AppButton'
import AppDialog from 'Components/ui/AppDialog'
import AppTextField from 'Components/ui/AppTextField'
import AppCheckbox from 'Components/ui/AppCheckbox'
import { colors, font } from 'Assets/mui_theme/designTokens'
import { importStoriesFromGroup } from 'Utilities/redux/groupsReducer'
import { getAllStories } from 'Utilities/redux/storiesReducer'

const ImportStoryModal = ({ open, setOpen, groupId }) => {
  const dispatch = useDispatch()
  const intl = useIntl()
  const { groups } = useSelector(({ groups }) => groups)
  const [selectedGroups, setSelectedGroups] = useState([])
  const [message, setMessage] = useState('')
  const group = groups.find(g => g.group_id === groupId)

  const options = groups
    .filter(g => g.group_id !== groupId)
    .map(g => ({ value: g.group_id, label: g.groupName }))

  const submitGroupImport = async () => {
    await dispatch(importStoriesFromGroup(groupId, selectedGroups, message))
    dispatch(getAllStories(group.language, { sort_by: 'date', order: -1 }))
    setOpen(false)
    setSelectedGroups([])
    setMessage('')
  }

  const dialogTitle = (
    <span>
      <FormattedMessage id="import-story" /> : {group?.groupName}
    </span>
  )

  return (
    <AppDialog open={open} onClose={() => setOpen(false)} title={dialogTitle}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1em' }}>
        <div>
          <h2 style={{ fontFamily: font.family, fontSize: 17, fontWeight: 600, margin: 0 }}>
            <FormattedMessage id="import-story-label" />
          </h2>
          <FormattedHTMLMessage id="import-story-description" />
        </div>

        <Select
          multiple
          displayEmpty
          fullWidth
          value={selectedGroups}
          onChange={e => setSelectedGroups(e.target.value)}
          input={<OutlinedInput />}
          renderValue={selected =>
            selected.length === 0 ? (
              <span style={{ color: colors.muted }}>
                {intl.formatMessage({ id: 'import-from' })}
              </span>
            ) : (
              options
                .filter(o => selected.includes(o.value))
                .map(o => o.label)
                .join(', ')
            )
          }
          MenuProps={{ disableScrollLock: true }}
          sx={{
            backgroundColor: colors.card,
            borderRadius: '999px',
            fontFamily: font.family,
            color: colors.ink,
            '& .MuiOutlinedInput-notchedOutline': { borderColor: colors.border },
            '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: colors.focus },
            '&.Mui-focused .MuiOutlinedInput-notchedOutline': { borderColor: colors.focus },
          }}
        >
          {options.map(o => (
            <MenuItem key={o.value} value={o.value}>
              <AppCheckbox checked={selectedGroups.includes(o.value)} />
              <ListItemText primary={o.label} />
            </MenuItem>
          ))}
        </Select>

        <AppTextField
          label={intl.formatMessage({ id: 'import-story-message' })}
          value={message}
          onChange={e => setMessage(e.target.value)}
        />

        <div
          style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '.5em' }}
        >
          <AppButton variant="secondary" onClick={() => setOpen(false)}>
            <FormattedMessage id="cancel" />
          </AppButton>
          <AppButton
            variant="primary"
            onClick={submitGroupImport}
            disabled={selectedGroups.length === 0}
          >
            <FormattedMessage id="import" />
          </AppButton>
        </div>
      </div>
    </AppDialog>
  )
}

export default ImportStoryModal
