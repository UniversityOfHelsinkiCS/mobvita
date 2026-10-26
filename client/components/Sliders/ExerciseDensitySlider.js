import React from 'react'
import { FormattedMessage } from 'react-intl'
import AppSlider from 'Components/ui/AppSlider'

// Exercise density (share of words turned into exercises), shown on a ×1000 integer scale.
const ExerciseDensitySlider = ({ sliderValue, setSliderValue, onAfterChange, isDisabled }) => {
  const minDensityPrct = 0.185
  const maxDensityPrct = 0.325

  return (
    <>
      <div className="exercise-density-slider">
        <AppSlider
          onChange={(_, value) => setSliderValue(value / 1000)}
          onChangeCommitted={(_, value) => onAfterChange(value / 1000)}
          min={minDensityPrct * 1000}
          max={maxDensityPrct * 1000}
          value={sliderValue * 1000}
          disabled={isDisabled}
          muted={isDisabled}
        />
      </div>

      <div className="space-between exercise-density-slider-label-cont bold">
        <span>
          <FormattedMessage id="easy" />
        </span>
        <span>
          <FormattedMessage id="average" />
        </span>
        <span>
          <FormattedMessage id="difficult" />
        </span>
      </div>
    </>
  )
}

export default ExerciseDensitySlider
