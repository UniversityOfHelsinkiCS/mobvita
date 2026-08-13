import React, { useState } from 'react'
import { useSelector } from 'react-redux'
import AppDialog from 'Components/ui/AppDialog'
import { useIntl, FormattedMessage } from 'react-intl'
import { hiddenFeatures } from 'Utilities/common'

const TestReport = () => {
  const intl = useIntl()
  const { report, debugReport } = useSelector(({ tests }) => tests)
  // semantic's `defaultOpen` — this component is only mounted while a report exists, so a fresh
  // mount starts open and the close (X) shuts it.
  const [open, setOpen] = useState(true)

  const translate = id => intl.formatMessage({ id })

  if (!report) return null

  return (
    <AppDialog
      open={open}
      onClose={() => setOpen(false)}
      maxWidth="xs"
      data-cy="exhaustive-test-report-modal"
      closeDataCy="exhaustive-test-report-close"
      title={<FormattedMessage id="test-results" />}
    >
      <>
        <div data-cy="exhaustive-test-report-total">
          {translate('total-answers')}: {report.total || '-'}
        </div>
        <div data-cy="exhaustive-test-report-accuracy">
          {translate('accuracy')}: {report.correctRate || '-'}%
        </div>
      </>
      {report.message !== 'OK' && (
        <>
          <hr />
          <div data-cy="exhaustive-test-report-message">{report.message}</div>
        </>
      )}
      <hr />
      {hiddenFeatures &&
        Object.entries(debugReport).map(([key, value]) => (
          <div key={key}>
            {key}: {value}
          </div>
        ))}
    </AppDialog>
  )
}

export default TestReport
