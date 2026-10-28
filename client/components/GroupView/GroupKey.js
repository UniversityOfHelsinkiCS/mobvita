import React from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { setNotification } from 'Utilities/redux/notificationReducer'
import { FormattedMessage } from 'react-intl'
import ContentCopyIcon from '@mui/icons-material/ContentCopy'
import AppButton from 'Components/AppButton'
import CustomTooltip from 'Components/CustomTooltip'

// The group's join key with a copy-to-clipboard button and its 30-day validity note.
const GroupKey = () => {
  const dispatch = useDispatch()
  const token = useSelector(state => state.groups.token)

  // Copies the key; the notice only shows once the browser confirms the copy.
  const handleTokenCopy = async () => {
    try {
      await navigator.clipboard.writeText(token)
      dispatch(setNotification('token-copied', 'info'))
    } catch {
      // Clipboard unavailable (insecure context or denied); nothing was copied.
    }
  }

  return (
    <div>
      <div
        style={{
          display: 'flex',
          marginTop: '0.5em',
          minHeight: '3em',
          wordBreak: 'break-all',
          border: '1px solid #dee2e6',
          borderRadius: '0.25rem',
        }}
      >
        <CustomTooltip permanent placement="top" title={<FormattedMessage id="copy-key" />}>
          <span style={{ display: 'inline-flex' }}>
            <AppButton
              type="button"
              onClick={handleTokenCopy}
              disabled={!token}
              data-cy="group-key-copy-button"
              style={{ margin: '0.5em', height: '36px' }}
            >
              <ContentCopyIcon fontSize="large" />
            </AppButton>
          </span>
        </CustomTooltip>
        <span style={{ margin: 'auto', padding: '0.5em' }} data-cy="group-key-token">
          {token}
        </span>
      </div>
      <div
        style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <span
          style={{
            margin: 'auto',
            padding: '0.5em',
            fontStyle: 'oblique',
            fontWeight: 'bold',
          }}
        >
          <FormattedMessage id="This key is valid for the next 30 days" />.
        </span>
      </div>
    </div>
  )
}

export default GroupKey
