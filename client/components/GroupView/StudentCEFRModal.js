import React from 'react'
import Draggable from 'react-draggable'

const StudentCEFRModal = ({ open }) => {

  if (open) {
    return (
      <Draggable cancel=".interactable">
        <div className="draggable-modal">
        
        </div>
      </Draggable>
    )
  }

  return null

}

export default StudentCEFRModal