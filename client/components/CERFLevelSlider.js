/* eslint-disable react/destructuring-assignment */
import React from 'react'
import { FormattedMessage } from 'react-intl'
import ReactSlider from 'react-slider'

const CERFLevelSlider = props => {
  console.log('value ', props.sliderValue, '  setSlider ', props.setSliderValue)

  const skillLevels = [
    'A1',
    'A1/A2',
    'A2',
    'A2/B1',
    'B1',
    'B1/B2',
    'B2',
    'B2/C1',
    'C1',
    'C1/C2',
    'C2',
  ]

  const handleSlider = value => {
    props.setSliderValue(value / 10)
  }

  return (
    <>
      <ReactSlider
        className="exercise-density-slider"
        thumbClassName="exercise-density-slider-thumb"
        trackClassName="exercise-density-slider-track"
        onChange={value => handleSlider(value)}
        min={0}
        max={1210}
        step={121}
        value={props.sliderValue}
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
