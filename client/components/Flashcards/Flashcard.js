import React, { useState } from 'react'

const Flashcard = ({ word }) => {
  const [flipped, setFlipped] = useState(false)

  const text = flipped ? word.translations : word.root

  return (
    <div
      style={{ display: 'flex', width: '50%', height: '50%', margin: 'auto' }}
      className="border"
      tabIndex="-1"
      role="button"
      onKeyDown={() => () => setFlipped(!flipped)}
      onClick={() => setFlipped(!flipped)}
    >
      <h2 style={{ margin: 'auto' }}>{text}</h2>
    </div>
  )
}

export default Flashcard
