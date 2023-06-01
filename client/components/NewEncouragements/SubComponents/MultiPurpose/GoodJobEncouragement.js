import React, { useState, useEffect } from 'react'
import { images, backgroundColors } from 'Utilities/common'
import { useHistory, useParams } from 'react-router-dom'
import { FormattedHTMLMessage, FormattedMessage } from 'react-intl'

const GoodJobEncouragement = () => {
  const history = useHistory()
  const messageKeys = [
    'encouragements-excellent',
    'encouragements-default-1',
    'encouragements-default-2',
    'encouragements-default-3',
    'encouragements-default-4',
  ]
  const [messageKey, setMessageKey] = useState(messageKeys[0])
  useEffect(() => {
    const id = Math.floor(Math.random() * messageKeys.length)
    setMessageKey(messageKeys[id])
  }, [history.location.pathname])


  return (
    <div className="pt-md">
        <div
        className="flex enc-message-body"
        style={{ alignItems: 'center', backgroundColor: backgroundColors[4] }}
        >
        <img
            src={images.encTrophy}
            alt="encouraging trophy"
            style={{ maxWidth: '8%', maxHeight: '8%', marginRight: '1em' }}
        />
        <div>
            <FormattedHTMLMessage id={messageKey}/>
        </div>
        </div>
    </div>
    )
}

export default GoodJobEncouragement