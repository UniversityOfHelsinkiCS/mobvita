import React from 'react'
import Spinner from 'Components/Spinner'

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
        <div
          style={{
            height: '1.5em',
            textAlign: 'center',
            borderRadius: '1rem',
            position: 'relative',
          }}
          className="progress"
        >
          <span
            data-cy="snippet-progress"
            style={{
              ...getFontStyle(),
              position: 'absolute',
              top: '50%',
              transform: 'translateY(-50%)',
              right: 0,
              left: 0,
              lineHeight: 1,
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
