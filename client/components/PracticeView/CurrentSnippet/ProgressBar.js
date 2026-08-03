import React from 'react'
import AppProgressBar from 'Components/ui/AppProgressBar'

const ProgressBar = ({ snippetProgress, snippetsTotal, progress }) => (
  <AppProgressBar
    value={snippetsTotal ? (progress || 0) * 100 : 0}
    label={snippetsTotal ? `${snippetProgress} / ${snippetsTotal}` : undefined}
    labelProps={{ 'data-cy': 'snippet-progress' }}
  />
)

export default ProgressBar
