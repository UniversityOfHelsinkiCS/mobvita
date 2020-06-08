import React from 'react'
import { useSelector } from 'react-redux'
import { Modal } from 'semantic-ui-react'
import { useIntl } from 'react-intl'

const TestReport = () => {
  const intl = useIntl()
  const { report } = useSelector(({ tests }) => tests)

  const translate = id => intl.formatMessage({ id })

  return (
    <Modal size="mini" dimmer="inverted" closeIcon defaultOpen centered={false}>
      <Modal.Header>
        {translate('overall-score')}
      </Modal.Header>
      <Modal.Content>
        <>
          <div>{translate('correct-answers')}: {report.correct || '-'}</div>
          <div>{translate('total-answers')}: {report.total || '-'}</div>
          <div>{translate('Accuracy')}: {report.correctRate || '-'}%</div>
        </>
        {report.message !== 'OK' && (
          <>
            <hr />
            <div>{report.message}</div>
          </>
        )}
      </Modal.Content>
    </Modal>
  )
}

export default TestReport
