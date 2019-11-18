import React from 'react'

import { Input, Icon } from 'semantic-ui-react'

const ExerciseCloze = ({
  word, handleChange, handleClick,
}) => (
  <Input
      key={word.ID}
      icon={<Icon name="volume up" link onClick={() => handleClick(word.base)} />}
      placeholder={`${word.base}...`}
      onChange={e => handleChange(e, word)}
      transparent
      style={{width: `${Math.floor(word.surface.length * 15)}px`, height:'30px'}}
      onClick={()=> console.log(word.surface)}
    />
)

export default ExerciseCloze
