import React from 'react'
import AppProgressBar from 'Components/ui/AppProgressBar'

// `hideLabel` lets a caller render the "n / total" count itself (e.g. to the left of the bar)
// instead of overlaying it centered on the track.
const ProgressBar = ({ snippetProgress, snippetsTotal, progress, hideLabel = false }) => (
  <AppProgressBar
    value={snippetsTotal ? (progress || 0) * 100 : 0}
    label={hideLabel || !snippetsTotal ? undefined : `${snippetProgress} / ${snippetsTotal}`}
    labelProps={{ 'data-cy': 'snippet-progress' }}
  />
)

export default ProgressBar
