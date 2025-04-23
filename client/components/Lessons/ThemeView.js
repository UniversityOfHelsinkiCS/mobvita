import React from 'react'

import ToggleButton from './ToggleButton'

const ThemeView = ({ currentStepIndex, selectedSemantics, lesson_semantics, toggleSemantic }) => {
  const handleThemeClick = name => {
    toggleSemantic(name)
  }

  if (currentStepIndex !== 0) {
    return null
  }

  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(2, 260px)',
        gridTemplateRows: 'repeat(2, 200px)',
        gap: '30px',
        justifyContent: 'center',
      }}
      data-cy="practice-categories"
    >
      {lesson_semantics.map(name => (
        <ToggleButton
          key={name}
          handleClick={() => handleThemeClick(name)}
          name={name.toLowerCase()}
          active={selectedSemantics.includes(name)}
        />
      ))}
    </div>
  )
}

export default ThemeView
