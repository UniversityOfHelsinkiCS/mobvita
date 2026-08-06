import React from 'react'
import { images } from 'Utilities/common'

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
      <img src={images.arrowRight} alt="next" style={{ width: 40, height: 40 }} />
    </button>
  )
}

export default ArrowButton
