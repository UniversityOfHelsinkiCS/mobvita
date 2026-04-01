import React from 'react'
import { Icon } from 'semantic-ui-react'

const ArrowButton = ({ disabled, onClick, hidden = false }) => {
  if (hidden) return null

  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className="flashcard-arrow-button"
      style={{ marginLeft: 0 }}
    >
      <Icon name="angle double right" size="huge" />
    </button>
  )
}

export default ArrowButton
