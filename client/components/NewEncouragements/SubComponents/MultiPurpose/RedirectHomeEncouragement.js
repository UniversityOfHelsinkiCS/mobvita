import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { images, backgroundColors } from 'Utilities/common'
import { FormattedHTMLMessage, FormattedMessage } from 'react-intl'

const RedirectHomeEncouragement = () => {

  const link = (
    <Link className="interactable" to="/home">
        <FormattedMessage id="Home" />
    </Link>
  )

  return (
    <div className="pt-md">
        <div
        className="flex enc-message-body"
        style={{ alignItems: 'center', backgroundColor: backgroundColors[3] }}
        >
        <img
            src={images.revitaLogoTransparent}
            alt="encouraging logo"
            style={{ maxWidth: '8%', maxHeight: '8%', marginRight: '1em' }}
        />
        <div>
            <FormattedMessage id='have-a-break' values={{link}}/>
        </div>
        </div>
    </div>
    )
}

export default RedirectHomeEncouragement