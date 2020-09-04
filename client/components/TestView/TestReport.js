import React from 'react'
import { useSelector } from 'react-redux'
import { Modal } from 'semantic-ui-react'
import { useIntl } from 'react-intl'
import { hiddenFeatures } from 'Utilities/common'

const TestReport = () => {
  const intl = useIntl()
  const { report, debugReport } = useSelector(({ tests }) => tests)

  const translate = id => intl.formatMessage({ id })

  if (!report) return null

  return (
    <Modal size="mini" dimmer="inverted" closeIcon defaultOpen centered={false}>
      <Modal.Header>{translate('overall-score')}</Modal.Header>
      <Modal.Content>
        <>
          <div>
            {translate('total-answers')}: {report.total || '-'}
          </div>
          <div>
            {translate('Accuracy')}: {report.correctRate || '-'}%
          </div>
        </>
        {report.message !== 'OK' && (
          <>
            <hr />
            <div>{report.message}</div>
          </>
        )}
        <hr />
        {hiddenFeatures &&
          Object.entries(debugReport).map(([key, value]) => (
            <div key={key}>
              {key}: {value}
            </div>
          ))}
      </Modal.Content>
    </Modal>
  )
}

export default TestReport
