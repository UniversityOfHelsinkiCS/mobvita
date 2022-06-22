/* eslint-disable react/destructuring-assignment */
import React from 'react'
import ReactSlider from 'react-slider'

const CERFLevelSlider = props => {
  const handleSlider = value => {
    props.setSliderValue(value)
  }

  return (
    <>
      <ReactSlider
        className="exercise-density-slider"
        thumbClassName="exercise-density-slider-thumb"
        trackClassName={!props.isDisabled ? 'exercise-density-slider-track' : 'disabled-track'}
        onAfterChange={value => handleSlider(value)}
        min={0}
        max={1210}
        step={121}
        value={props.sliderValue}
        disabled={props.isDisabled}
      />

      <div className="space-between exercise-density-slider-label-cont bold">
        <span>A1</span>
        <span>A2</span>
        <span>B1</span>
        <span>B2</span>
        <span>C1</span>
        <span>C2</span>
      </div>
    </>
  )
}

export default CERFLevelSlider
