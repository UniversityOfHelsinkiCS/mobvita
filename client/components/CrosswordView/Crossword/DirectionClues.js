import React from 'react'

import Clue from './Clue'

export default function DirectionClues({ direction, clues }) {
  return (
    <div className="direction">
      {/* use something other than h3? */}
      <h3 className="header">{direction.toUpperCase()}</h3>
      {clues.map(({ number, clue, correct }) => (
        <Clue key={number} direction={direction} number={number} correct={correct}>
          {clue}
        </Clue>
      ))}
    </div>
  )
}
