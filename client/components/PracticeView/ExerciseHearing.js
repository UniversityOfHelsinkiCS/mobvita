import React from 'react'
import { Input, Icon } from 'semantic-ui-react'

const ExerciseHearing = ({ word, handleClick, handleChange }) => (
    <Input
      key={word.ID}
      onChange={e => handleChange(e, word)}
      icon={<Icon name="volume up" link onClick={() => handleClick(word.base)} />}
      placeholder={'______________'}
      transparent
      style={{width: `${Math.floor(word.surface.length * 15)}px`, height:'30px'}}
    />
  )


export default ExerciseHearing
