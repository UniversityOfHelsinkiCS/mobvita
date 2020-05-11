import React, { useState } from 'react'
import { Icon } from 'semantic-ui-react'

const Banner = ({ message }) => {
  const [show, setShow] = useState(true)

  if (!show) return null

  return (
    <div className="banner">
      <div dangerouslySetInnerHTML={{ __html: message }} />
      <Icon
        name="close"
        onClick={() => setShow(false)}
        style={{ color: '#004085', cursor: 'pointer' }}
      />
    </div>
  )
}

export default Banner
