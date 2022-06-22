/* eslint-disable react/destructuring-assignment */
import React from 'react'
import ReactSlider from 'react-slider'
import { useHistory } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import { updateExerciseTemplate } from 'Utilities/redux/userReducer'

const CERFLevelSlider = props => {
  const history = useHistory()
  const dispatch = useDispatch()
  const inSettingsView = history.location.pathname.includes('settings')
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
    props.setSliderValue(value)
    const minified = value / 11
    const rounded = Math.floor(minified / 10)
    console.log(rounded)
    if (rounded === 11) {
      props.setChosenSkillLevel('C2')
      dispatch(updateExerciseTemplate('C2'))
    } else {
      props.setChosenSkillLevel(skillLevels[rounded])
      dispatch(updateExerciseTemplate(skillLevels[rounded]))
    }
  }
  console.log('ACUAL ', props.sliderValue)

  return (
    <>
      <ReactSlider
        className="exercise-density-slider"
        thumbClassName="exercise-density-slider-thumb"
        trackClassName="exercise-density-slider-track"
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
