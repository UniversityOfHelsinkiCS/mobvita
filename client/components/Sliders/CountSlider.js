import React from 'react'
import AppSlider from 'Components/ui/AppSlider'
import useSliderDraft from './useSliderDraft'

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
  const draft = useSliderDraft(value, onChange)

  return (
    <div className="lesson-vocab-slider-container" style={style}>
      <div className="exercise-density-slider">
        <AppSlider {...draft} min={minValue} max={maxValue} step={step} />
      </div>
      <div className="space-between exercise-density-slider-label-cont bold">
        {sliderMarks.map(level => (
          <span key={level}>{level}</span>
        ))}
      </div>
    </div>
  )
}

export default CountSlider
