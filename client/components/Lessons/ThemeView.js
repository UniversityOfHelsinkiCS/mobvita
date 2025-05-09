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
        gridTemplateColumns: 'repeat(2, 1fr)',
        gridTemplateRows: 'repeat(2, 1fr)',
        gap: '30px',
        height: '100%',
        maxWidth: '500px',
      }}
      data-cy="practice-categories"
    >
      {lesson_semantics.map(name => (
        <ToggleButton
          key={name}
          handleClick={() => handleThemeClick(name)}
          name={name.toLowerCase()}
          active={selectedSemantics?.includes(name)}
        />
      ))}
    </div>
  )
}

export default ThemeView
