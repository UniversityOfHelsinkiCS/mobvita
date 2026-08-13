import React, { useState } from 'react'
import { useDispatch } from 'react-redux'
import { FormattedMessage, useIntl } from 'react-intl'
import AppButton from 'Components/AppButton'
import AppSelect from 'Components/ui/AppSelect'

const EnableTestMenu = ({
  setGroupTestDeadline,
  setCurrTestDeadline,
  setShowTestEnableMenuGroupId,
  id,
}) => {
  const dispatch = useDispatch()
  const intl = useIntl()
  const [chosenTestDuration, setChosenTestDuration] = useState(Date.now() + 7200000)
  // AppSelect is controlled (semantic's Dropdown kept its own selection state internally), so the
  // picked option is mirrored here purely so the trigger shows the chosen label.
  const [selectedDurationOption, setSelectedDurationOption] = useState(null)

  const testTimeOptions = [
    {
      value: 7200000,
      label: intl.formatMessage({ id: '2-hours' }),
    },
    {
      value: 10800000,
      label: intl.formatMessage({ id: '3-hours' }),
    },
    {
      value: 14400000,
      label: intl.formatMessage({ id: '4-hours' }),
    },
    {
      value: 86400000,
      label: intl.formatMessage({ id: '24-hours' }),
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

  const handleTestDurationChange = value => {
    setSelectedDurationOption(value)
    setChosenTestDuration(Date.now() + value)
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
        <span style={{ margin: 'auto', padding: '0.5em' }}>
          <b>
            <FormattedMessage id="enable-test-for" />
          </b>{' '}
          <span style={{ display: 'inline-flex', verticalAlign: 'middle' }}>
            <AppSelect
              value={selectedDurationOption}
              onChange={handleTestDurationChange}
              placeholder={intl.formatMessage({ id: '2-hours' })}
              variant="contrast-outline"
              minWidth={120}
              options={testTimeOptions}
            />
          </span>
          <AppButton
            data-cy="enable-test-ok-button"
            type="button"
            onClick={handleTestEnableClick}
            variant="success"
            style={{ margin: '0.5em' }}
          >
            OK
          </AppButton>
          <div
            style={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
            }}
          >
            <AppButton
              onClick={handleTestButtonCancel}
              variant="danger"
              data-cy="enable-test-cancel-button"
              style={{ margin: '0.2em' }}
            >
              <FormattedMessage id="Cancel" />
            </AppButton>
          </div>
        </span>
      </div>
    </div>
  )
}

export default EnableTestMenu
