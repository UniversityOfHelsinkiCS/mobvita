import React from 'react'

const ProgressBar = ({ snippetProgress, snippetsTotal, progress }) => {
  return (
    <div style={{ height: '2.5em', marginTop: '0.5em', textAlign: 'center' }} className="progress">
      <span
        data-cy="snippet-progress"
        style={{
          marginTop: '1em',
          fontSize: 'larger',
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
  )
}

export default ProgressBar
