import { useState } from 'react'

// Keeps the thumb following the drag when the parent only updates `value` on release.
// Returns AppSlider props; `onCommit` gets the released value.
const useSliderDraft = (value, onCommit) => {
  const [draft, setDraft] = useState(null)

  return {
    value: draft ?? value,
    onChange: (_, next) => setDraft(next),
    onChangeCommitted: (_, next) => {
      setDraft(null)
      onCommit(next)
    },
  }
}

export default useSliderDraft
