import React from 'react'
import Spinner from 'Components/Spinner'
import AppProgressBar from 'Components/ui/AppProgressBar'

const ProgressBar = ({ snippetProgress, snippetsTotal, progress }) => {
  const getFontStyle = () => {
    if (progress > 0.5) {
      return { color: 'white', textShadow: '0px 0px 2px #000' }
    }
    return { color: 'black', textShadow: '0px 0px 2px #FFF' }
  }
  return (
    <>
      {!snippetsTotal ? (
        <Spinner />
      ) : (
        <AppProgressBar
          value={progress * 100}
          label={`${snippetProgress} / ${snippetsTotal}`}
          labelProps={{ 'data-cy': 'snippet-progress', style: getFontStyle() }}
        />
      )}
    </>
  )
}

export default ProgressBar
