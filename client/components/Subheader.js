import React from 'react'
import { FormattedMessage } from 'react-intl'

const Subheader = ({ imgSource, imgAlt, translationId }) => {
  return (
    <div>
      {imgSource && <img src={imgSource} alt={imgAlt} height="18px" />}
      <span style={{ color: '#777', fontSize: '12px', fontWeight: 550, paddingLeft: '.5rem' }}>
        <FormattedMessage id={translationId} />
      </span>
      <hr style={{ marginTop: 0 }} />
    </div>
  )
}

export default Subheader
