import FormattedHTMLMessage from 'Components/FormattedHTMLMessage';
import React, { useState, useEffect } from 'react'
import { images, backgroundColors } from 'Utilities/common'
import { useLocation } from 'react-router'
import { FormattedMessage } from 'react-intl';

// Random words of praise with a trophy.
const GoodJobEncouragement = () => {
  const location = useLocation()

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
  }, [location.pathname])


  return (
    <div className="pt-md">
        <div
        className="flex enc-message-body"
        style={{ alignItems: 'center', backgroundColor: backgroundColors[4] }}
        >
        <img
            src={images.trophy}
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