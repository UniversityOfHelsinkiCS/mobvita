import React from 'react'
import { Modal } from 'semantic-ui-react'
import AddStoryAccordion from './AddStoryAccordion'

const AddStoryModal = ({ setLibraries, trigger }) => {
  return (
    <Modal
      basic
      dimmer="inverted"
      closeIcon={{ style: { top: '2.5rem', right: '2.5rem' }, color: 'black', name: 'close' }}
      trigger={trigger}
    >
      <Modal.Content>
        <AddStoryAccordion setLibraries={setLibraries} />
      </Modal.Content>
    </Modal>
  )
}

export default AddStoryModal
