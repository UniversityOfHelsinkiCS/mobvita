import React from 'react'
import { FormattedMessage, FormattedHTMLMessage } from 'react-intl'
import { Popup } from 'semantic-ui-react'

const MasteredLegends = ({ numEncountered, numRewardable, numMastered, numNotMastered }) => {
  const calculatePercent = (a, b) => {
    if (b === 0 || a === 0) {
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
          <Popup
            content={<FormattedMessage id="red-bar-explanation" />}
            trigger={
              <span style={{ color: '#DC143C', cursor: 'pointer' }}>
                <FormattedHTMLMessage
                  id="red-bar-label"
                  values={{
                    nWords: numNotMastered,
                    percent: calculatePercent(numNotMastered, numEncountered),
                  }}
                />
              </span>
            }
          />
        </div>
        <div>
          <Popup
            content={<FormattedMessage id="blue-bar-explanation" />}
            trigger={
              <span style={{ color: '#4169e1', cursor: 'pointer', marginRight: '.5em' }}>
                <FormattedHTMLMessage
                  id="blue-bar-label"
                  values={{
                    nWords: numRewardable,
                    percent: calculatePercent(numRewardable, numEncountered),
                  }}
                />
              </span>
            }
          />
        </div>
        <div>
          <Popup
            content={<FormattedMessage id="green-bar-explanation" />}
            trigger={
              <span style={{ color: '#228B22', cursor: 'pointer', marginRight: '.5em' }}>
                <FormattedHTMLMessage
                  id="green-bar-label"
                  values={{
                    nWords: numMastered,
                    percent: calculatePercent(numMastered, numEncountered),
                  }}
                />
              </span>
            }
          />
        </div>
      </div>
    </>
  )
}

export default MasteredLegends
