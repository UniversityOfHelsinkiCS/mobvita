import React from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { setNotification } from 'Utilities/redux/notificationReducer'
import { CopyToClipboard } from 'react-copy-to-clipboard'
import { FormattedMessage } from 'react-intl'
import ContentCopyIcon from '@mui/icons-material/ContentCopy'
import AppButton from 'Components/AppButton'
import CustomTooltip from 'Components/CustomTooltip'

const GroupKey = () => {
  const dispatch = useDispatch()
  const token = useSelector(state => state.groups.token)

  const handleTokenCopy = () => {
    dispatch(setNotification('token-copied', 'info'))
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
            <CopyToClipboard text={token}>
              <AppButton
                type="button"
                onClick={handleTokenCopy}
                disabled={!token}
                data-cy="group-key-copy-button"
              >
                <ContentCopyIcon fontSize="large" />
              </AppButton>
            </CopyToClipboard>
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
