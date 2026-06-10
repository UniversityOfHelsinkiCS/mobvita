import React from 'react'
import ReactSlider from 'react-slider'
import { useIntl } from 'react-intl'
import styled from 'styled-components'
import { getSliderThumbColor } from './sliderThumbColor'
import './SliderStyles.scss'

const StyledMark = localizedMarkString => props => {
  const StyledMarkSpan = styled.span`
    background: transparent;
    border-left: 10px solid transparent;
    border-right: 10px solid transparent;
    border-top: 15px solid #000;
    padding: 0;
    &:hover::before {
      content: '${localizedMarkString}';
      position: absolute;
      background-color: #333;
      color: #fff;
      padding: 5px 10px;
      border-radius: 4px;
      bottom: 100%;
      left: 50%;
      transform: translateX(-50%);
      opacity: 0.9;
      z-index: 1;
    }
  `
  return <StyledMarkSpan {...props} />
}

const roundToNearestInt = number => Math.round(number)

/**
 * Shared vocabulary difficulty slider (0–100 scale).
 *
 * Props:
 *   value           – current slider value (0-100)
 *   onChange        – called with new value when slider moves
 *   recommendedValue – user's baseline score; shown as a marker
 *   disabled        – (optional) disables the slider
 *   style           – (optional) style for the outer container div
 *   skillLevels     – array of skill levels to display on the slider
 *                     IF all levels should not be shown, empty strings can be used for the levels that should be hidden.
 *                     For example: ["Pre-A1", "A1", "", "A2", "", "B1", "", "B2", "", "C1", "", "C2", "C2+"]
 *                     The array must contain all 13 items so that the levels remain in their correct positions on the slider.
 *                     Empty values keep the levels in their correct positions while hiding the labels.
 *   min             – minimum value for the slider (default 0)
 *   max             – maximum value for the slider (default 100)
 */
const VocabDiffSlider = ({
  value,
  onChange,
  recommendedValue,
  disabled,
  style,
  skillLevels,
  min = 0,
  max = 100,
}) => {
  const intl = useIntl()
  const thumbClassName = `${getSliderThumbColor(value, min, max)} exercise-density-slider-thumb`
  const markComp = StyledMark(intl.formatMessage({ id: 'Recommended vocabulary difficulty' }))

  return (
    <div style={style}>
      <ReactSlider
        className="exercise-density-slider"
        thumbClassName={thumbClassName}
        trackClassName="exercise-density-slider-track"
        renderMark={markComp}
        marks={[roundToNearestInt(recommendedValue)]}
        snapDragDisabled={false}
        onAfterChange={onChange}
        onSliderClick={onChange}
        min={min}
        max={max}
        step={1}
        value={value}
        disabled={disabled}
      />
      <div className="space-between exercise-density-slider-label-cont bold">
        {skillLevels.map(level => <span key={level}>{level}</span>)}
      </div>
    </div>
  )
}

export default VocabDiffSlider
