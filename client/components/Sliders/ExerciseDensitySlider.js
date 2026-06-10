import React from 'react'
import { FormattedMessage } from 'react-intl'
import ReactSlider from 'react-slider'

const ExerciseDensitySlider = ({ sliderValue, setSliderValue, onAfterChange, isDisabled }) => {
  const minDensityPrct = 0.185
  const maxDensityPrct = 0.325

  return (
    <>
      <ReactSlider
        className="exercise-density-slider"
        thumbClassName="exercise-density-slider-thumb"
        trackClassName={!isDisabled ? 'exercise-density-slider-track' : 'disabled-track'}
        onChange={value => setSliderValue(value / 1000)}
        onAfterChange={value => onAfterChange(value / 1000)}
        min={minDensityPrct * 1000}
        max={maxDensityPrct * 1000}
        value={sliderValue * 1000}
        disabled={isDisabled}
      />

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
