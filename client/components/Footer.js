import React from 'react'
import { images } from 'Utilities/common'
import LoginPlaceholder from 'Components/LoginPlaceholder'

export default () => (
  <div className="footer" style={{ display: 'flex', justifyContent: 'space-between' }}>
    <LoginPlaceholder style={{ flex: 'auto' }} />
    <img src={images.revitaLogoTransparent} style={{ height: '100%', float: 'right' }} alt="tosca" />
  </div>
)
