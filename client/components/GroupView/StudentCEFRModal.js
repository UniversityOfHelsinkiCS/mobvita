import React from 'react'
import { Icon } from 'semantic-ui-react'
import Draggable from 'react-draggable'

const StudentCEFRModal = ({ open, setOpen, cefrHistory }) => {

  const closeModal = () => {
    setOpen(false)
  }
  console.log('his ', cefrHistory)
  if (open) {
    return (
      <Draggable cancel=".interactable">
        <div className="draggable-modal">
          <div className="flex-reverse">
            <Icon
              className="interactable"
              style={{
                cursor: 'pointer',
                marginBottom: '.25em',
              }}
              size="large"
              name="close"
              onClick={closeModal}
            />
          </div>
          MODAALI
        </div>
      </Draggable>
    )
  }

  return null
}

export default StudentCEFRModal
