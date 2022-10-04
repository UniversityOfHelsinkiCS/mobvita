import React, { useState } from 'react'
import { useDispatch } from 'react-redux'
import { FormattedMessage, useIntl } from 'react-intl'
import { Dropdown } from 'semantic-ui-react'
import { Button } from 'react-bootstrap'

const EnableTestMenu = ({
  setGroupTestDeadline,
  setCurrTestDeadline,
  setShowTestEnableMenuGroupId,
  id,
}) => {
  const dispatch = useDispatch()
  const intl = useIntl()
  const [chosenTestDuration, setChosenTestDuration] = useState(Date.now() + 7200000)

  const testTimeOptions = [
    {
      key: '2-hours',
      text: intl.formatMessage({ id: '2-hours' }),
      value: 7200000,
    },
    {
      key: '3-hours',
      text: intl.formatMessage({ id: '3-hours' }),
      value: 10800000,
    },
    {
      key: '4-hours',
      text: intl.formatMessage({ id: '4-hours' }),
      value: 14400000,
    },
    {
      key: '24-hours',
      text: intl.formatMessage({ id: '24-hours' }),
      value: 86400000,
    },
  ]

  const handleTestEnableClick = async () => {
    await dispatch(setGroupTestDeadline(chosenTestDuration, id))
    setCurrTestDeadline(chosenTestDuration)
    setShowTestEnableMenuGroupId(null)
  }

  const handleTestButtonCancel = async () => {
    setShowTestEnableMenuGroupId(null)
  }

  const handleTestDurationChange = (e, { value }) => {
    setChosenTestDuration(Date.now() + value)
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
        <span style={{ margin: 'auto', padding: '0.5em' }}>
          <b>
            <FormattedMessage id="enable-test-for" />
          </b>{' '}
          <Dropdown
            onChange={handleTestDurationChange}
            placeholder={intl.formatMessage({ id: '2-hours' })}
            selection
            style={{ minWidth: '120px' }}
            options={testTimeOptions}
          />
          <Button
            data-cy="enable-test-ok-button"
            type="button"
            onClick={handleTestEnableClick}
            variant="success"
            style={{ margin: '0.5em' }}
          >
            OK
          </Button>
          <div
            style={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
            }}
          >
            <Button onClick={handleTestButtonCancel} variant="danger" style={{ margin: '0.2em' }}>
              <FormattedMessage id="Cancel" />
            </Button>
          </div>
        </span>
      </div>
    </div>
  )
}

export default EnableTestMenu
