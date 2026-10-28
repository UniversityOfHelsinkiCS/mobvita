import React from 'react'
import { useIntl } from 'react-intl'
import AppSlider from 'Components/ui/AppSlider'
import useSliderDraft from './useSliderDraft'

// Black down-pointing triangle above the track at the recommended value; hover shows `hint`.
const recommendedMarkSx = hint => ({
  '& .MuiSlider-mark, & .MuiSlider-markActive': {
    top: 0,
    width: 0,
    height: 0,
    transform: 'translateX(-50%)',
    backgroundColor: 'transparent',
    borderRadius: 0,
    opacity: 1,
    borderLeft: '10px solid transparent',
    borderRight: '10px solid transparent',
    borderTop: '15px solid #000',
    pointerEvents: 'auto', // keep the hint on hover while the slider is disabled
    '&:hover::before': {
      content: JSON.stringify(hint),
      position: 'absolute',
      backgroundColor: '#333',
      color: '#fff',
      padding: '5px 10px',
      borderRadius: '4px',
      bottom: '100%',
      left: '50%',
      transform: 'translateX(-50%)',
      opacity: 0.9,
      zIndex: 1,
    },
  },
})

/**
 * Shared vocabulary difficulty slider (0–100 scale).
 *
 * Props:
 *   value           – current slider value (0-100)
 *   onChange        – called with new value when slider moves
 *   recommendedValue – user's baseline score; shown as a marker
 *   disabled        – (optional) disables the slider
 *   style           – (optional) style for the outer container div
 *   className       – (optional) class for the outer container div (e.g. a tour target)
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
  className,
  skillLevels,
  min = 0,
  max = 100,
}) => {
  const intl = useIntl()
  const draft = useSliderDraft(value, onChange)
  const recommended = Math.round(recommendedValue)
  const marks = Number.isFinite(recommended) ? [{ value: recommended }] : false

  return (
    <div className={className} style={style}>
      <div className="exercise-density-slider">
        <AppSlider
          {...draft}
          marks={marks}
          min={min}
          max={max}
          step={1}
          disabled={disabled}
          sx={recommendedMarkSx(intl.formatMessage({ id: 'Recommended vocabulary difficulty' }))}
        />
      </div>
      <div className="space-between exercise-density-slider-label-cont bold">
        {skillLevels.map(level => (
          <span key={level}>{level}</span>
        ))}
      </div>
    </div>
  )
}

export default VocabDiffSlider
