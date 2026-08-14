// eslint-disable-next-line no-unused-vars
import React from 'react'
import { FormattedMessage } from 'react-intl'
import AppButton from 'Components/AppButton'
import { images, capitalize } from 'Utilities/common'

// Design-system icon per lesson theme. Add an entry here when a new theme is introduced.
const THEME_ICONS = {
  culture: images.brush01Pick,
  politics: images.globe02,
  science: images.microscope,
  sport: images.trophy01Pick,
}

// Per-theme filter for the unselected (colored) state — e.g. the sport trophy reads too light, so
// darken it a little.
const INACTIVE_ICON_FILTER = {
  sport: 'brightness(0.75)',
}

const ThemeView = ({ currentStepIndex, selectedSemantics, lesson_semantics, toggleSemantic }) => {
  if (currentStepIndex !== 0) {
    return null
  }

  return (
    <div
      className="lesson-story-topic"
      data-cy="practice-categories"
      style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(2, 1fr)',
        gap: '16px',
        width: '100%',
        maxWidth: 480,
      }}
    >
      {lesson_semantics.map(name => {
        const key = name.toLowerCase()
        const active = selectedSemantics?.includes(name)
        return (
          <AppButton
            key={name}
            className="theme-card"
            variant={active ? 'primary' : 'card'}
            onClick={() => toggleSemantic(name)}
            sx={{
              borderRadius: '16px',
              minHeight: 84,
              gap: '12px',
              fontSize: 18,
              fontWeight: 600,
              // One colored icon per theme: `brightness(0)` renders it as a black silhouette when
              // the card is selected (green bg), and shows it in full colour (optionally darkened
              // per theme) when it isn't.
              '& img': {
                width: 26,
                height: 26,
                filter: active ? 'brightness(0)' : INACTIVE_ICON_FILTER[key] || 'none',
              },
            }}
          >
            {THEME_ICONS[key] && <img src={THEME_ICONS[key]} alt="" />}
            <FormattedMessage id={capitalize(key)} />
          </AppButton>
        )
      })}
    </div>
  )
}

export default ThemeView
