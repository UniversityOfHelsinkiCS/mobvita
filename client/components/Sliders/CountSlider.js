import React from 'react'
import ReactSlider from 'react-slider'
import './SliderStyles.scss'

/**
 * Reusable slider component for selecting a count value.
 *
 * Props:
 * - value: Current slider value.
 * - onChange: Called when the user finishes changing the value.
 * - minValue: Minimum slider value.
 * - maxValue: Maximum slider value.
 * - step: Step size for the slider.
 * - sliderMarks: Optional array of labels displayed below the slider.
 * - style: Optional inline styles for the container.
 */
const CountSlider = ({ value, onChange, minValue, maxValue, step, sliderMarks = [], style }) => {
  return (
    <div className="lesson-vocab-slider-container" style={style}>
      <ReactSlider
        className="exercise-density-slider"
        trackClassName="exercise-density-slider-track"
        thumbClassName="exercise-density-slider-thumb"
        onAfterChange={onChange}
        onSliderClick={onChange}
        min={minValue}
        max={maxValue}
        step={step}
        value={value}
      />
      <div className="space-between exercise-density-slider-label-cont bold">
        {sliderMarks.map(level => (
          <span key={level}>{level}</span>
        ))}
      </div>
    </div>
  )
}

export default CountSlider
