import React from 'react'
import { images, capitalize } from 'Utilities/common'

const ToggleButton = ({ handleClick, name, extraImgSrc, width = '100%', active }) => {
  const imgSrc = extraImgSrc ?? `${name}1`

  return (
    <button
      style={{ width }}
      className={`lesson-setup-btn ${active ? 'active' : 'inactive'}`}
      variant="light"
      data-cy={name}
      type="button"
      onClick={handleClick}
    >
      <div>
        <div style={{ marginBottom: images[imgSrc] ? '1em' : '0' }}>
          {/* <FormattedMessage id={capitalize(name)} /> */}
          {capitalize(name)}
        </div>
        {images[imgSrc] && (
          <img src={images[imgSrc]} alt={name} style={{ maxWidth: '45%', maxHeight: '45%' }} />
        )}
      </div>
    </button>
  )
}

export default ToggleButton
