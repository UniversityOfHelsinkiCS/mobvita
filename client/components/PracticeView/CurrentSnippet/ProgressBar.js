import React from 'react'
import Spinner from 'Components/Spinner'

const ProgressBar = ({ snippetProgress, snippetsTotal, progress }) => {
  const getFontStyle = () => {
    if (progress > 0.5) {
      return { color: 'white', textShadow: '4px 4px 4px #000' }
    }
    return { color: 'black' }
  }
  return (
    <>
      {!snippetsTotal ? (
        <Spinner />
      ) : (
        <div
          style={{
            height: '1.5em',
            textAlign: 'center',
          }}
          className="progress"
        >
          <span
            data-cy="snippet-progress"
            style={{
              ...getFontStyle(),
              marginTop: '0.75em',
              position: 'absolute',
              right: 0,
              left: 0,
            }}
          >
            {`${snippetProgress} / ${snippetsTotal}`}
          </span>
          <div
            className="progress-bar progress-bar-striped bg-info"
            style={{ width: `${progress * 100}%` }}
            role="progressbar"
            aria-valuenow={progress}
            aria-valuemin="0"
            aria-valuemax="100"
          />
        </div>
      )}
    </>
  )
}

export default ProgressBar
