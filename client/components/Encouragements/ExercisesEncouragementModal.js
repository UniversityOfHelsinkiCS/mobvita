import React, { useState } from 'react'
import { Modal } from 'semantic-ui-react'

const ExercisesEncouragementModal = ({ open, setOpen, storiesCovered }) => {
  console.log('rendered')
  console.log('is open ', open)

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
        <div className="bold">Congratulations! You have covered {storiesCovered} stories</div>
      </Modal.Content>
    </Modal>
  )
}

export default ExercisesEncouragementModal
