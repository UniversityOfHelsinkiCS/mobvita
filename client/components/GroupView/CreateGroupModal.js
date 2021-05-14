import React from 'react'
import { Modal } from 'semantic-ui-react'
import { FormattedMessage } from 'react-intl'
import CreateGroupForm from './CreateGroupForm'

export default function CreateGroupModal({ trigger, role }) {
  return (
    <Modal
      dimmer="inverted"
      closeIcon={{ style: { top: '1.0535rem', right: '1rem' }, color: 'black', name: 'close' }}
      trigger={trigger}
    >
      <Modal.Header className="bold" as="h2">
        <FormattedMessage id="create-new-group" />
      </Modal.Header>
      <Modal.Content>
        <CreateGroupForm role={role} />
      </Modal.Content>
    </Modal>
  )
}
