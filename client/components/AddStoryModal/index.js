import React from 'react'
import { Modal } from 'semantic-ui-react'
import AddStoryAccordion from './AddStoryAccordion'

const AddStoryModal = ({ open, setOpen }) => {
  return (
    <Modal
      basic
      open={open}
      centered={false}
      dimmer="inverted"
      closeIcon={{ style: { top: '2.5rem', right: '2.5rem' }, color: 'black', name: 'close' }}
      onClose={() => setOpen(false)}
    >
      <Modal.Content>
        <AddStoryAccordion closeModal={() => setOpen(false)} />
      </Modal.Content>
    </Modal>
  )
}

export default AddStoryModal
