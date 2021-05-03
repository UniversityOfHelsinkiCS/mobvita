import React, { useState } from 'react'
import { Modal } from 'semantic-ui-react'
import AddStoryAccordion from './AddStoryAccordion'

const AddStoryModal = ({ trigger }) => {
  const [showModal, setShowModal] = useState(false)

  const closeModal = () => {
    setShowModal(false)
  }

  return (
    <Modal
      basic
      open={showModal}
      dimmer="inverted"
      closeIcon={{ style: { top: '2.5rem', right: '2.5rem' }, color: 'black', name: 'close' }}
      trigger={trigger}
      onClose={() => setShowModal(false)}
      onOpen={() => setShowModal(true)}
    >
      <Modal.Content>
        <AddStoryAccordion closeModal={closeModal} />
      </Modal.Content>
    </Modal>
  )
}

export default AddStoryModal
