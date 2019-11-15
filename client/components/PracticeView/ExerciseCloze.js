import React from 'react'

import { Input, Icon } from 'semantic-ui-react'

const ExerciseCloze = ({
  word, handleChange, handleClick,
}) => (
  <Input
      key={word.ID}
      defaultValue={word.base}
      onChange={e => handleChange(e, word)}
      label={{ basic: true, content: <Icon name="volume up" onClick={() => handleClick(word.base)} /> }}
      labelPosition="right"
    />
)

export default ExerciseCloze
