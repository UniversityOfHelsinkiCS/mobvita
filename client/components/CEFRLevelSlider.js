/* eslint-disable react/destructuring-assignment */
import React from 'react'
import ReactSlider from 'react-slider'

const CERFLevelSlider = ({ isDisabled, sliderValue, setSliderValue, noExtremeValue=true }) => {
  const handleSlider = value => {
    if (value < 121 && noExtremeValue) {
      setSliderValue(121)
    } else if (value > 968 && noExtremeValue) {
      setSliderValue(968)
    } else {
      setSliderValue(value)
    }
  }

  return (
    <>
      <ReactSlider
        className="exercise-density-slider"
        thumbClassName="exercise-density-slider-thumb"
        trackClassName={!isDisabled ? 'exercise-density-slider-track' : 'disabled-track'}
        onAfterChange={value => handleSlider(value)}
        min={0}
        max={1210}
        step={121}
        value={sliderValue}
        disabled={isDisabled}
      />

      <div className="space-between exercise-density-slider-label-cont bold">
        <span style={{ color: noExtremeValue ? 'lightgrey' : '#000000' }}>A1</span>
        <span style={{ color: isDisabled ? 'lightgrey' : '#000000' }}>A2</span>
        <span style={{ color: isDisabled ? 'lightgrey' : '#000000' }}>B1</span>
        <span style={{ color: isDisabled ? 'lightgrey' : '#000000' }}>B2</span>
        <span style={{ color: isDisabled ? 'lightgrey' : '#000000' }}>C1</span>
        <span style={{ color: noExtremeValue ? 'lightgrey' : '#000000' }}>C2</span>
      </div>
    </>
  )
}

export default CERFLevelSlider
