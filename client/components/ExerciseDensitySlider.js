import React from 'react'
import { FormattedMessage } from 'react-intl'
import Slider from 'rc-slider'
import useWindowDimensions from 'Utilities/windowDimensions'
import 'rc-slider/assets/index.css'

const ExerciseDensitySlider = ({ sliderValue, setSliderValue, onAfterChange, isDisabled }) => {
  const bigWindow = useWindowDimensions().width >= 640

  return (
    <>
      <div style={{ display: 'flex', width: bigWindow ? '50%' : '100%', margin: '1em 0em' }}>
        <Slider
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
          handlePersonalOptionClick
          included
          onChange={value => setSliderValue(value)}
          onAfterChange={() => onAfterChange(sliderValue)}
        />
      </div>
      <div
        className="bold"
        style={{
          width: bigWindow ? '50%' : '100%',
          display: 'flex',
          justifyContent: 'space-between',
          marginBottom: '1em',
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
