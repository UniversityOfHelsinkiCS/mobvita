import React from 'react'
import {Link} from "react-router-dom"
import { images } from 'Utilities/common'

export default () => (
  <div className="navbar">
    <Link to="/">
      <img src={images.revitaLogoTransparent} style={{ height: '100%' }} alt="mobvita-logo" />
    </Link>
  </div>
)
