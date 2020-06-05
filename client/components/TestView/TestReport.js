import React from 'react'
import { useSelector } from 'react-redux'
import { Modal } from 'semantic-ui-react'

const TestReport = () => {
  const { report } = useSelector(({ tests }) => tests)

  return (
    <Modal dimmer="inverted" closeIcon defaultOpen>
      <Modal.Header>
        Test report
      </Modal.Header>
      <Modal.Content>
        {JSON.stringify(report)}
      </Modal.Content>
    </Modal>
  )
}

export default TestReport
