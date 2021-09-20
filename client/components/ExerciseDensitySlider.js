import React from 'react'
import { FormattedMessage } from 'react-intl'
// import Slider from 'rc-slider'
import ReactSlider from 'react-slider'

const Slider = ({ sliderValue, setSliderValue, onAfterChange, isDisabled }) => {
  return (
    <ReactSlider
      className="exercise-density-slider"
      thumbClassName="exercise-density-slider-thumb"
      trackClassName="exercise-density-slider-track"
      onChange={value => setSliderValue(value / 1000)}
      onAfterChange={value => onAfterChange(value / 1000)}
      min={185}
      max={325}
      value={sliderValue * 1000}
      disabled={isDisabled}
    />
  )
}

const ExerciseDensitySlider = ({ sliderValue, setSliderValue, onAfterChange, isDisabled }) => {
  return (
    <>
      <Slider
        sliderValue={sliderValue}
        setSliderValue={setSliderValue}
        onAfterChange={onAfterChange}
        isDisabled={isDisabled}
      />

      {/* <div style={{ display: 'flex', width: bigWindow ? '50%' : '100%', margin: '1em 0em' }}> */}
      {/* <Slider
          style={{ margin: '1em 1em .1em 1em' }}
          value={sliderValue}
          min={0.185}
          max={0.325}
          step={0.001}
          railStyle={{ color: 'red', backgroundColor: '#b8e4ff', height: 2 }}
          trackStyle={{ backgroundColor: '#0000BE' }}
          handleStyle={{
            backgroundColor: '#FFF',
            width: 25,
            height: 25,
            marginTop: -12,
            borderColor: '#c7c7c7',
          }}
          disabled={isDisabled}
          onChange={value => setSliderValue(value)}
          onAfterChange={() => onAfterChange(sliderValue)}
        /> */}

      {/* </div> */}

      <div
        className="exercise-density-slider-label-cont bold"
        style={{
          display: 'flex',
          justifyContent: 'space-between',
        }}
      >
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
