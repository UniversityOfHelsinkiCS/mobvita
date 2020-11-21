import React from 'react'
import { FormattedMessage } from 'react-intl'
import { capitalize } from 'Utilities/common'
import Medal from './Medal'

const MedalInfo = ({ amount, medal }) => (
  <div className="medal-info">
    <Medal medal={medal} />
    <div className="flex-col pl-sm">
      <span className="medal-amount">{amount}</span>
      <span className="medal-name">
        <FormattedMessage id={capitalize(medal)} />
      </span>
    </div>
  </div>
)

export default MedalInfo
