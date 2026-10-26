/* eslint-disable react/destructuring-assignment */
import React from 'react'
import AppSlider from 'Components/ui/AppSlider'
import useSliderDraft from './useSliderDraft'

// CEFR level slider (A1–C2); with noExtremeValue a release on A1 or C2 snaps back inside.
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
  const draft = useSliderDraft(sliderValue, handleSlider)

  return (
    <>
      <div className="exercise-density-slider">
        <AppSlider
          {...draft}
          min={0}
          max={1210}
          step={121}
          disabled={isDisabled}
          muted={isDisabled}
        />
      </div>

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
