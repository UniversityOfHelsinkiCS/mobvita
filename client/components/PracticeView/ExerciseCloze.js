import React from 'react'

import { Input, Icon } from 'semantic-ui-react'

const ExerciseCloze = ({ word, handleChange, handleClick }) => {
  const { isWrong, mark, tested } = word

  let color = ''
  let disabled = false

  if (tested) {
    if (isWrong) {
      color = 'red'
    } else {
      color = 'green'
      disabled = true
    }
  }

  return (
    <Input
      disabled={disabled}
      key={word.ID}
      icon={<Icon name="volume up" link onClick={() => handleClick(word.base || word.bases, word.lemmas)} />}
      placeholder={`${word.base || word.bases}...`}
      onChange={e => handleChange(e, word)}
      transparent
      style={{
        minWidth: `${Math.floor(word.base ? word.base.length : word.bases.length)}em`,
        width: `${Math.floor(word.surface.length + 2)}em`,
        height: '30px',
        backgroundColor: color,
      }}
    />
  )
}

export default ExerciseCloze
