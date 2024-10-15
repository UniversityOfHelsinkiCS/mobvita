import React from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { setNotification } from 'Utilities/redux/notificationReducer'
import { CopyToClipboard } from 'react-copy-to-clipboard'
import { FormattedMessage } from 'react-intl'
import { Icon, Popup } from 'semantic-ui-react'
import { Button } from 'react-bootstrap'

const GroupKey = () => {
  const dispatch = useDispatch()
  const token = useSelector(state => state.groups.token)

  const handleTokenCopy = () => {
    dispatch(setNotification('token-copied', 'info'))
  }

  return (
    <div>
      <div
        className="border rounded"
        style={{
          display: 'flex',
          marginTop: '0.5em',
          minHeight: '3em',
          wordBreak: 'break-all',
        }}
      >
        <Popup
          position="top center"
          content={<FormattedMessage id="copy-key" />}
          trigger={
            <CopyToClipboard text={token}>
              <Button type="button" onClick={handleTokenCopy} disabled={!token}>
                <Icon name="copy" size="large" />
              </Button>
            </CopyToClipboard>
          }
        />
        <span style={{ margin: 'auto', padding: '0.5em' }}>{token}</span>
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
