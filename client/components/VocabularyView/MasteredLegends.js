import FormattedHTMLMessage from 'Components/FormattedHTMLMessage';
import React from 'react'
import { FormattedMessage } from 'react-intl';
import CustomTooltip from 'Components/CustomTooltip'

const MasteredLegends = ({ numEncountered, numRewardable, numMastered, numNotMastered }) => {
  const calculatePercent = (a, b) => {
    if (b === 0 || a === 0 || !a || !b) {
      return 0
    }
    return Math.round((a / b) * 100)
  }

  return (
    <>
      <div className="col-flex">
        <div>
          <FormattedHTMLMessage id="total-words-encountered" values={{ nWords: numEncountered }} />
        </div>
        <div>
          <CustomTooltip title={<FormattedMessage id="red-bar-explanation" />}>
            <span style={{ color: '#DC143C', cursor: 'pointer' }}>
              <FormattedHTMLMessage
                id="red-bar-label"
                values={{
                  nWords: numNotMastered,
                  percent: calculatePercent(numNotMastered, numEncountered),
                }}
              />
            </span>
          </CustomTooltip>
        </div>
        <div>
          <CustomTooltip title={<FormattedMessage id="blue-bar-explanation" />}>
            <span style={{ color: '#4169e1', cursor: 'pointer', marginRight: '.5em' }}>
              <FormattedHTMLMessage
                id="blue-bar-label"
                values={{
                  nWords: numRewardable,
                  percent: calculatePercent(numRewardable, numEncountered),
                }}
              />
            </span>
          </CustomTooltip>
        </div>
        <div>
          <CustomTooltip title={<FormattedMessage id="green-bar-explanation" />}>
            <span style={{ color: '#228B22', cursor: 'pointer', marginRight: '.5em' }}>
              <FormattedHTMLMessage
                id="green-bar-label"
                values={{
                  nWords: numMastered,
                  percent: calculatePercent(numMastered, numEncountered),
                }}
              />
            </span>
          </CustomTooltip>
        </div>
      </div>
    </>
  )
}

export default MasteredLegends
