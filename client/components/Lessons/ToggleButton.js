import React from 'react'
import { images, capitalize } from 'Utilities/common'
import { Button } from 'react-bootstrap'
import { Icon } from 'semantic-ui-react'

const ToggleButton = ({
  handleClick,
  name,
  extraImgSrc,
  width = '100%',
  height = '100%',
  active,
}) => {
  const imgSrc = extraImgSrc ?? `${name}1`

  return (
    <>
      <Button
        className="toggle-button"
        variant={active ? 'primary' : 'outline-primary'}
        onClick={handleClick}
        style={{ width, height }}
      >
        <div style={{ display: 'flex', justifyContent: 'center', height: '100%' }}>
          <div>
            <Icon name="check" style={{ flex: '0.1', visibility: active ? 'visible' : 'hidden' }} />
          </div>
          <div
            style={{
              flex: '1',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              alignItems: 'center',
            }}
          >
            <span style={{ marginBottom: images[imgSrc] ? '1em' : '0' }}>{capitalize(name)}</span>
            {images[imgSrc] && (
              <img src={images[imgSrc]} alt={name} style={{ maxWidth: '50%', maxHeight: '50%' }} />
            )}
          </div>
          <div>
            <Icon name="check" style={{ flex: '0.1', visibility: 'hidden' }} />
          </div>
        </div>
      </Button>
    </>
  )
}

export default ToggleButton
