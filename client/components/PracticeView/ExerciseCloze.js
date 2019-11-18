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
      style={{width: `${Math.floor(word.base.length * 2)}0px`, height:'30px'}}
    />
)

export default ExerciseCloze
