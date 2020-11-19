import React from 'react'
import { FormattedMessage } from 'react-intl'
import { Icon } from 'semantic-ui-react'

const Subheader = ({ imgSource, imgAlt, iconName, translationId, color = '#777' }) => {
  return (
    <div>
      {imgSource && <img src={imgSource} alt={imgAlt} height="18px" />}
      {iconName && <Icon name={iconName} style={{ color }} />}
      <span
        style={{ color, fontSize: '12px', fontWeight: 550, paddingLeft: iconName ? 0 : '.5rem' }}
      >
        <FormattedMessage id={translationId} />
      </span>
      <hr style={{ marginTop: 0 }} />
    </div>
  )
}

export default Subheader
